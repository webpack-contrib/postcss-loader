'use strict'

const path = require('path')

const loaderUtils = require('loader-utils')

const parseOptions = require('./options')
const validateOptions = require('schema-utils') // eslint-disable-line

const postcss = require('postcss')
const postcssrc = require('postcss-load-config')

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
module.exports = function loader (css, map) {
  const cb = this.async()
  const file = this.resourcePath

  const options = loaderUtils.getOptions(this) || {}

  // TODO
  // validateOptions('./node_modules/postcss-loader/lib/options.json', options, 'PostCSS Loader')

  const rc = {
    path: '',
    ctx: {
      file: {
        extname: path.extname(file),
        dirname: path.dirname(file),
        basename: path.basename(file)
      }
    }
  }

  if (options.config) {
    options.config.path
      ? rc.path = path.resolve(options.config.path)
      : rc.path = path.dirname(file)

    options.config.ctx
      ? rc.ctx.options = options.config.ctx
      : rc.ctx.options = {}
  }

  const sourceMap = options.sourceMap

  Promise.resolve().then(() => {
    if (
      Object.keys(options).length !== 0 ||
      ((rc || sourceMap) && Object.keys(options).length > 1) ||
      ((rc && sourceMap) && Object.keys(options).length > 2)
    ) {
      return parseOptions.call(this, options)
    }

    return postcssrc(rc.ctx, rc.path, { argv: false })
  }).then((config) => {
    if (!config) config = {}

    if (config.file) this.addDependency(config.file)

    let plugins = config.plugins || []
    let options = Object.assign({
      to: file,
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

    if (typeof map === 'string') map = JSON.parse(map)
    if (map && map.mappings) options.map.prev = map

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

        if (this.loaderIndex === 0) {
          /**
           * @memberof loader
           * @callback cb
           *
           * @param {Object} null   Error
           * @param {String} result Result (JS Module)
           * @param {Object} map    Source Map
           */
          return cb(null, `module.exports = ${JSON.stringify(css)}`, map)
        }
        /**
         * @memberof loader
         * @callback cb
         *
         * @param {Object} null Error
         * @param {String} css  Result (Raw Module)
         * @param {Object} map  Source Map
         */
        return cb(null, css, map)
      })
  }).catch((err) => {
    return err.name === 'CssSyntaxError' ? cb(new SyntaxError(err)) : cb(err)
  })
}
