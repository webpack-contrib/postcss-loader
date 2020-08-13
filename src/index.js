import path from 'path';

import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import postcss from 'postcss';

import Warning from './Warning';
import SyntaxError from './Error';
import parseOptions from './options';
import schema from './options.json';
import { exec, loadConfig, createPostCssPlugins } from './utils';

/**
 * **PostCSS Loader**
 *
 * Loads && processes CSS with [PostCSS](https://github.com/postcss/postcss)
 *
 * @method loader
 *
 * @param {String} content Source
 * @param {Object} sourceMap Source Map
 *
 * @return {callback} callback Result
 */

export default async function loader(content, sourceMap, meta = {}) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'PostCSS Loader',
    baseDataPath: 'options',
  });

  const callback = this.async();
  const file = this.resourcePath;
  let configRc = {};

  options.config =
    options.config === false
      ? options.config
      : typeof options.config !== 'undefined'
      ? options.config
      : true;

  if (options.config) {
    const rc = {
      path: path.dirname(file),
      ctx: {
        file: {
          extname: path.extname(file),
          dirname: path.dirname(file),
          basename: path.basename(file),
        },
        options: {},
      },
    };

    if (typeof options.config.path !== 'undefined') {
      rc.path = path.resolve(options.config.path);
    }

    if (typeof options.config.ctx !== 'undefined') {
      rc.ctx.options = options.config.ctx;
    }

    rc.ctx.webpack = this;

    try {
      configRc = await loadConfig(options.config, rc.ctx, rc.path, this.fs);
      delete options.config;
    } catch (error) {
      callback(error);

      return;
    }
  }

  function pluginsToArray(plugins) {
    if (typeof plugins === 'undefined') {
      return [];
    }

    if (Array.isArray(plugins)) {
      return plugins;
    }

    return [plugins];
  }

  const mergedOptions = {
    ...configRc,
    ...options,
    plugins: [
      ...pluginsToArray(configRc.plugins),
      ...pluginsToArray(options.plugins),
    ],
  };

  let config;

  const { length } = Object.keys(mergedOptions).filter((option) => {
    switch (option) {
      // case 'exec':
      // case 'ident':
      case 'config':
      case 'sourceMap':
        return false;
      default:
        return option;
    }
  });

  if (length) {
    config = parseOptions.call(this, mergedOptions);
  }

  if (config.file) {
    this.addDependency(config.file);
  }

  if (typeof config.options !== 'undefined') {
    if (typeof config.options.to !== 'undefined') {
      delete config.options.to;
    }

    if (typeof config.options.from !== 'undefined') {
      delete config.options.from;
    }
  }

  const plugins = config.plugins || [];

  const postcssOptions = Object.assign(
    {
      from: file,
      map: options.sourceMap
        ? options.sourceMap === 'inline'
          ? { inline: true, annotation: false }
          : { inline: false, annotation: false }
        : false,
    },
    config.options
  );

  // Loader Exec (Deprecated)
  // https://webpack.js.org/api/loaders/#deprecated-context-properties
  if (postcssOptions.parser === 'postcss-js') {
    // eslint-disable-next-line no-param-reassign
    content = exec(content, this);
  }

  if (typeof postcssOptions.parser === 'string') {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    postcssOptions.parser = require(postcssOptions.parser);
  }

  if (typeof postcssOptions.syntax === 'string') {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    postcssOptions.syntax = require(postcssOptions.syntax);
  }

  if (typeof postcssOptions.stringifier === 'string') {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    postcssOptions.stringifier = require(postcssOptions.stringifier);
  }

  // Loader API Exec (Deprecated)
  // https://webpack.js.org/api/loaders/#deprecated-context-properties
  if (config.exec) {
    // eslint-disable-next-line no-param-reassign
    content = exec(content, this);
  }

  if (options.sourceMap && typeof sourceMap === 'string') {
    // eslint-disable-next-line no-param-reassign
    sourceMap = JSON.parse(sourceMap);
  }

  if (options.sourceMap && sourceMap) {
    postcssOptions.map.prev = sourceMap;
  }

  const resultPlugins = createPostCssPlugins(plugins, file);

  let result;

  try {
    result = await postcss(resultPlugins).process(content, postcssOptions);
  } catch (error) {
    if (error.file) {
      this.addDependency(error.file);
    }

    if (error.name === 'CssSyntaxError') {
      callback(new SyntaxError(error));
    } else {
      callback(error);
    }

    return;
  }

  const { css, root, processor, messages } = result;
  let { map } = result;

  result.warnings().forEach((warning) => {
    this.emitWarning(new Warning(warning));
  });

  messages.forEach((msg) => {
    if (msg.type === 'dependency') {
      this.addDependency(msg.file);
    }
  });

  map = map ? map.toJSON() : null;

  if (map) {
    map.file = path.resolve(map.file);
    map.sources = map.sources.map((src) => path.resolve(src));
  }

  const ast = {
    type: 'postcss',
    version: processor.version,
    root,
  };

  const newMeta = { ...meta, ast, messages };

  /**
   * @memberof loader
   * @callback callback
   *
   * @param {Object} null Error
   * @param {String} css  Result (Raw Module)
   * @param {Object} map  Source Map
   */
  callback(null, css, map, newMeta);
}

/**
 * @author Andrey Sitnik (@ai) <andrey@sitnik.ru>
 *
 * @license MIT
 * @version 3.0.0
 *
 * @module postcss-loader
 *
 * @requires path
 *
 * @requires loader-utils
 * @requires schema-utils
 *
 * @requires postcss
 * @requires postcss-load-config
 *
 * @requires ./options.js
 * @requires ./Warning.js
 * @requires ./SyntaxError.js
 */
