import path from 'path';
import Module from 'module';

import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import postcss from 'postcss';
import postcssrc from 'postcss-load-config';

import Warning from './Warning';
import SyntaxError from './Error';
import parseOptions from './options';
import schema from './options.json';

const parentModule = module;

function exec(code, loaderContext) {
  const { resource, context } = loaderContext;

  const module = new Module(resource, parentModule);

  // eslint-disable-next-line no-underscore-dangle
  module.paths = Module._nodeModulePaths(context);
  module.filename = resource;

  // eslint-disable-next-line no-underscore-dangle
  module._compile(code, resource);

  return module.exports;
}

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
  let config;

  const { length } = Object.keys(options).filter((option) => {
    switch (option) {
      // case 'exec':
      case 'ident':
      case 'config':
      case 'sourceMap':
        return false;
      default:
        return option;
    }
  });

  if (length) {
    try {
      config = await parseOptions.call(this, options);
    } catch (error) {
      callback(error);

      return;
    }
  } else {
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

    if (options.config) {
      if (options.config.path) {
        rc.path = path.resolve(options.config.path);
      }

      if (options.config.ctx) {
        rc.ctx.options = options.config.ctx;
      }
    }

    rc.ctx.webpack = this;

    try {
      config = await postcssrc(rc.ctx, rc.path);
    } catch (error) {
      callback(error);

      return;
    }
  }

  if (typeof config === 'undefined') {
    config = {};
  }

  if (config.file) {
    this.addDependency(config.file);
  }

  // Disable override `to` option from `postcss.config.js`
  if (config.options.to) {
    // eslint-disable-next-line no-param-reassign
    delete config.options.to;
  }
  // Disable override `from` option from `postcss.config.js`
  if (config.options.from) {
    // eslint-disable-next-line no-param-reassign
    delete config.options.from;
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

  let result;

  try {
    result = await postcss(plugins).process(content, postcssOptions);
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
