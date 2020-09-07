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
  normalizeSourceMap,
  normalizeSourceMapAfterPostcss,
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

export default async function loader(content, sourceMap) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'PostCSS Loader',
    baseDataPath: 'options',
  });

  const callback = this.async();

  const configOption =
    typeof options.postcssOptions === 'undefined' ||
    typeof options.postcssOptions.config === 'undefined'
      ? true
      : options.postcssOptions.config;
  let loadedConfig = {};

  if (configOption) {
    try {
      loadedConfig = await loadConfig(this, configOption);
    } catch (error) {
      callback(error);

      return;
    }
  }

  const useSourceMap =
    typeof options.sourceMap !== 'undefined'
      ? options.sourceMap
      : this.sourceMap;

  const { plugins, processOptions } = getPostcssOptions(
    this,
    loadedConfig,
    options.postcssOptions
  );

  if (options.execute) {
    // eslint-disable-next-line no-param-reassign
    content = exec(content, this);
  }

  if (useSourceMap) {
    processOptions.map = { inline: false, annotation: false };

    if (sourceMap) {
      processOptions.map.prev = normalizeSourceMap(
        sourceMap,
        this.resourcePath
      );
    }
  } else if (sourceMap && typeof processOptions.map !== 'undefined') {
    if (typeof processOptions.map === 'boolean') {
      processOptions.map = { inline: true };
    }

    processOptions.map.prev = sourceMap;
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

  for (const warning of result.warnings()) {
    this.emitWarning(new Warning(warning));
  }

  for (const message of result.messages) {
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
  }

  // eslint-disable-next-line no-undefined
  let map = result.map ? result.map.toJSON() : undefined;

  if (map && useSourceMap) {
    map = normalizeSourceMapAfterPostcss(map, this.resourcePath);
  }

  const ast = {
    type: 'postcss',
    version: result.processor.version,
    root: result.root,
  };

  callback(null, result.css, map, { ast });
}
