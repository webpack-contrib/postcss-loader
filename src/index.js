import path from 'path';

import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import postcss from 'postcss';

import Warning from './Warning';
import SyntaxError from './Error';
import schema from './options.json';
import {
  loadConfig,
  getPostcssOptions,
  exec,
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

  const file = this.resourcePath;
  const configOptions =
    typeof options.postcssOptions === 'undefined' ||
    typeof options.postcssOptions.config === 'undefined'
      ? true
      : options.postcssOptions.config;

  let loadedConfig = {};

  const callback = this.async();

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

  const useSourceMap =
    typeof options.sourceMap !== 'undefined'
      ? options.sourceMap
      : this.sourceMap;

  const { plugins, processOptions, needExecute } = getPostcssOptions(
    this,
    loadedConfig,
    options.postcssOptions
  );

  if (options.exec || needExecute) {
    // eslint-disable-next-line no-param-reassign
    content = exec(content, this);
  }

  if (useSourceMap) {
    processOptions.map = { inline: false, annotation: false };
    // options.sourceMap === 'inline'
    //   ? { inline: true, annotation: false }
    //   : { inline: false, annotation: false };

    if (sourceMap) {
      const sourceMapNormalized = normalizeSourceMap(sourceMap);

      sourceMapNormalized.sources = sourceMapNormalized.sources.map((src) =>
        getSourceMapRelativePath(src, path.dirname(file))
      );

      processOptions.map.prev = sourceMapNormalized;
    }
  }

  let result;

  try {
    result = await postcss(plugins).process(content, processOptions);
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

  result.warnings().forEach((warning) => {
    this.emitWarning(new Warning(warning));
  });

  result.messages.forEach((message) => {
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

  const map = result.map ? result.map.toJSON() : null;

  if (map && useSourceMap) {
    if (typeof map.file !== 'undefined') {
      delete map.file;
    }

    map.sources = map.sources.map((src) => getSourceMapAbsolutePath(src, file));
  }

  const ast = {
    type: 'postcss',
    version: result.processor.version,
    root: result.result,
  };

  const newMeta = { ...meta, ast };

  callback(null, result.css, map, newMeta);
}
