import path from 'path';

import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import postcss from 'postcss';

import Warning from './Warning';
import SyntaxError from './Error';
import schema from './options.json';
import {
  exec,
  loadConfig,
  getArrayPlugins,
  getSourceMapAbsolutePath,
  getSourceMapRelativePath,
  normalizeSourceMap,
} from './utils';

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

  const configOptions =
    typeof options.postcssOptions === 'undefined' ||
    typeof options.postcssOptions.config === 'undefined'
      ? true
      : options.postcssOptions.config;

  let loadedConfig = {};

  if (configOptions) {
    const dataForLoadConfig = {
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

    if (typeof configOptions.path !== 'undefined') {
      dataForLoadConfig.path = path.resolve(configOptions.path);
    }

    if (typeof configOptions.ctx !== 'undefined') {
      dataForLoadConfig.ctx.options = configOptions.ctx;
    }

    dataForLoadConfig.ctx.webpack = this;

    try {
      loadedConfig = await loadConfig(
        configOptions,
        dataForLoadConfig.ctx,
        dataForLoadConfig.path,
        this
      );
    } catch (error) {
      callback(error);

      return;
    }
  }

  options.postcssOptions = options.postcssOptions || {};

  let plugins;

  const disabledPlugins = [];

  try {
    plugins = [
      ...getArrayPlugins(loadedConfig.plugins, file, false, this),
      ...getArrayPlugins(
        options.postcssOptions.plugins,
        file,
        disabledPlugins,
        this
      ),
    ].filter((i) => !disabledPlugins.includes(i.postcssPlugin));
  } catch (error) {
    this.emitError(error);
  }

  const mergedOptions = {
    ...loadedConfig,
    ...options,
    plugins,
  };

  mergedOptions.postcssOptions.plugins = plugins;

  const resultPlugins = mergedOptions.postcssOptions.plugins;

  const useSourceMap =
    typeof options.sourceMap !== 'undefined'
      ? options.sourceMap
      : this.sourceMap;

  const sourceMapNormalized =
    sourceMap && useSourceMap ? normalizeSourceMap(sourceMap) : null;

  if (sourceMapNormalized) {
    sourceMapNormalized.sources = sourceMapNormalized.sources.map((src) =>
      getSourceMapRelativePath(src, path.dirname(file))
    );
  }

  const postcssOptions = {
    from: file,
    to: file,
    map: useSourceMap
      ? options.sourceMap === 'inline'
        ? { inline: true, annotation: false }
        : { inline: false, annotation: false }
      : false,
    ...mergedOptions.postcssOptions,
  };

  if (postcssOptions.map && sourceMapNormalized) {
    postcssOptions.map.prev = sourceMapNormalized;
  }

  if (postcssOptions.parser === 'postcss-js') {
    // eslint-disable-next-line no-param-reassign
    content = exec(content, this);
  }

  if (typeof postcssOptions.parser === 'string') {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      postcssOptions.parser = require(postcssOptions.parser);
    } catch (error) {
      this.emitError(
        `Loading PostCSS Parser failed: ${error.message}\n\n(@${file})`
      );
    }
  }

  if (typeof postcssOptions.syntax === 'string') {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      postcssOptions.syntax = require(postcssOptions.syntax);
    } catch (error) {
      this.emitError(
        `Loading PostCSS Syntax failed: ${error.message}\n\n(@${file})`
      );
    }
  }

  if (typeof postcssOptions.stringifier === 'string') {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      postcssOptions.stringifier = require(postcssOptions.stringifier);
    } catch (error) {
      this.emitError(
        `Loading PostCSS Stringifier failed: ${error.message}\n\n(@${file})`
      );
    }
  }

  if (mergedOptions.exec) {
    // eslint-disable-next-line no-param-reassign
    content = exec(content, this);
  }

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

  messages.forEach((message) => {
    if (message.type === 'dependency') {
      this.addDependency(message.file);
    }

    if (message.type === 'asset' && message.content && message.file) {
      this.emitFile(
        message.file,
        message.content,
        message.sourceMap,
        message.info
      );
    }
  });

  map = map ? map.toJSON() : null;

  if (map && useSourceMap) {
    if (typeof map.file !== 'undefined') {
      delete map.file;
    }

    map.sources = map.sources.map((src) =>
      getSourceMapAbsolutePath(src, postcssOptions.to)
    );
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
 *
 * @requires ./Warning.js
 * @requires ./SyntaxError.js
 */
