'use strict'

const path = require('path')

const loaderUtils = require('loader-utils')

const parseOptions = require('./options')
const parseRc = require('./rc')
const validateOptions = require('schema-utils')

const postcss = require('postcss')

const SyntaxError = require('./Error')

/**
 * PostCSS Loader
 *
 * > Loads && processes CSS with [PostCSS](https://github.com/postcss/postcss)
 *
 * @author Andrey Sitnik (@ai) <andrey@sitnik.ru>
 *
 * @license MIT
 * @version 2.0.0
 *
 * @requires path
 *
 * @requires loader-utils
 * @requires schema-utils
 *
 * @requires postcss
 * @requires postcss-load-config
 *
 * @requires Error
 *
 * @method loader
 *
 * @param  {String} css Source
 * @param  {Object} map Source Map
 *
 * @return {cb} cb      Result
 */
module.exports = function loader (css, map, meta) {
  const options = Object.assign({}, loaderUtils.getOptions(this))

  validateOptions(require('./options.json'), options, 'PostCSS Loader')

  const cb = this.async()
  const file = this.resourcePath

  const sourceMap = options.sourceMap

  // Parse config from webpack options and rc
  Promise.all([
    (options.postcssrc !== false) ? parseRc(file, options) : null,
    parseOptions(options)
  ]).then((configs) => {
    // Merge configs
    const config = Object.assign({}, configs[0], configs[1])
    if (configs.every((config) => config && config.plugins)) {
      config.plugins = configs[0].plugins.concat(configs[1].plugins)
    }

    return config
  }).then((config) => {
    if (!config) config = {}

    if (config.file) this.addDependency(config.file)

    // Disable override `to` option from `postcss.config.js`
    if (config.options.to) delete config.options.to
    // Disable override `from` option from `postcss.config.js`
    if (config.options.from) delete config.options.from

    let plugins = config.plugins || []
    let options = Object.assign({
      from: file,
      map: sourceMap
        ? sourceMap === 'inline'
          ? { inline: true, annotation: false }
          : { inline: false, annotation: false }
        : false
    }, config.options)

    // Loader Exec (Deprecated)
    // https://webpack.js.org/api/loaders/#deprecated-context-properties
    if (options.parser === 'postcss-js') {
      css = this.exec(css, this.resource)
    }

    if (typeof options.parser === 'string') {
      options.parser = require(options.parser)
    }

    if (typeof options.syntax === 'string') {
      options.syntax = require(options.syntax)
    }

    if (typeof options.stringifier === 'string') {
      options.stringifier = require(options.stringifier)
    }

    // Loader API Exec (Deprecated)
    // https://webpack.js.org/api/loaders/#deprecated-context-properties
    if (config.exec) {
      css = this.exec(css, this.resource)
    }

    if (!sourceMap && map) {
      this.emitWarning(`\n\n ⚠️  PostCSS Loader\n\nPrevious source map found, but options.sourceMap isn't set.\nIn this case the loader will discard the source map entirely for performance reasons.\nSee https://github.com/postcss/postcss-loader#sourcemap for more information.\n\n`)
    }

    if (sourceMap && typeof map === 'string') map = JSON.parse(map)
    if (sourceMap && map) options.map.prev = map

    return postcss(plugins)
      .process(css, options)
      .then((result) => {
        result.warnings().forEach((msg) => this.emitWarning(msg.toString()))

        result.messages.forEach((msg) => {
          if (msg.type === 'dependency') this.addDependency(msg.file)
        })

        css = result.css
        map = result.map ? result.map.toJSON() : null

        if (map) {
          map.file = path.resolve(map.file)
          map.sources = map.sources.map((src) => path.resolve(src))
        }

        if (!meta) meta = {}

        meta.ast = { 'type': 'postcss', root: result.root }
        meta.messages = result.messages

        if (this.loaderIndex === 0) {
          /**
           * @memberof loader
           * @callback cb
           *
           * @param {Object} null   Error
           * @param {String} result Result (JS Module)
           * @param {Object} map    Source Map
           */
          cb(null, `module.exports = ${JSON.stringify(css)}`, map)

          return null
        }

        /**
         * @memberof loader
         * @callback cb
         *
         * @param {Object} null Error
         * @param {String} css  Result (Raw Module)
         * @param {Object} map  Source Map
         */
        cb(null, css, map, meta)

        return null
      })
  }).catch((err) => {
    if (err.file) this.addDependency(err.file)

    return err.name === 'CssSyntaxError' ? cb(new SyntaxError(err)) : cb(err)
  })
}
