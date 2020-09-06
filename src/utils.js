import path from 'path';
import Module from 'module';

import { cosmiconfig } from 'cosmiconfig';

const parentModule = module;

const stat = (inputFileSystem, filePath) =>
  new Promise((resolve, reject) => {
    inputFileSystem.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      }
      resolve(stats);
    });
  });

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

async function loadConfig(loaderContext, config) {
  const searchPath =
    typeof config === 'string'
      ? path.resolve(config)
      : path.dirname(loaderContext.resourcePath);

  let stats;

  try {
    stats = await stat(loaderContext.fs, searchPath);
  } catch (errorIgnore) {
    throw new Error(`No PostCSS Config found in: ${searchPath}`);
  }

  const explorer = cosmiconfig('postcss');

  let result;

  try {
    if (stats.isFile()) {
      result = await explorer.load(searchPath);
    } else {
      result = await explorer.search(searchPath);
    }
  } catch (error) {
    throw error;
  }

  if (!result) {
    return {};
  }

  let resultConfig = result.config || {};

  if (typeof resultConfig === 'function') {
    const api = {
      env: process.env.NODE_ENV,
      mode: loaderContext.mode,
      file: loaderContext.resourcePath,
      // For complex use
      webpackLoaderContext: loaderContext,
    };

    resultConfig = resultConfig(api);
  }

  resultConfig.file = result.filepath;

  loaderContext.addDependency(resultConfig.file);

  return resultConfig;
}

function loadPlugin(plugin, options, file) {
  // TODO defaults
  try {
    if (!options || Object.keys(options).length === 0) {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      return require(plugin);
    }

    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(plugin)(options);
  } catch (error) {
    throw new Error(
      `Loading PostCSS Plugin failed: ${error.message}\n\n(@${file})`
    );
  }
}

function pluginFactory() {
  const listOfPlugins = new Map();

  return (plugins) => {
    if (typeof plugins === 'undefined') {
      return listOfPlugins;
    }

    if (Array.isArray(plugins)) {
      for (const plugin of plugins) {
        if (Array.isArray(plugin)) {
          const [name, options] = plugin;

          listOfPlugins.set(name, options);
        } else if (
          plugin &&
          Object.keys(plugin).length === 1 &&
          (typeof plugin[Object.keys(plugin)[0]] === 'object' ||
            typeof plugin[Object.keys(plugin)[0]] === 'boolean') &&
          plugin[Object.keys(plugin)[0]] !== null
        ) {
          const [name] = Object.keys(plugin);
          const options = plugin[name];

          if (options === false) {
            listOfPlugins.delete(name);
          } else {
            listOfPlugins.set(name, options);
          }
        } else if (plugin) {
          listOfPlugins.set(plugin);
        }
      }
    } else {
      const objectPlugins = Object.entries(plugins);

      for (const [name, options] of objectPlugins) {
        if (options === false) {
          listOfPlugins.delete(name);
        } else {
          listOfPlugins.set(name, options);
        }
      }
    }

    return listOfPlugins;
  };
}

function getPostcssOptions(loaderContext, config, postcssOptions = {}) {
  const file = loaderContext.resourcePath;

  let normalizedPostcssOptions = postcssOptions;

  if (typeof normalizedPostcssOptions === 'function') {
    normalizedPostcssOptions = normalizedPostcssOptions(loaderContext);
  }

  let plugins = [];

  try {
    const factory = pluginFactory();

    factory(config.plugins);
    factory(normalizedPostcssOptions.plugins);

    plugins = [...factory()].map((item) => {
      const [plugin, options] = item;

      if (typeof plugin === 'string') {
        return loadPlugin(plugin, options, file);
      }

      return plugin;
    });
  } catch (error) {
    loaderContext.emitError(error);
  }

  const processOptionsFromConfig = { ...config };

  // No need them for processOptions
  delete processOptionsFromConfig.plugins;
  delete processOptionsFromConfig.file;

  const processOptionsFromOptions = { ...normalizedPostcssOptions };

  // No need them for processOptions
  delete processOptionsFromOptions.config;
  delete processOptionsFromOptions.plugins;

  const processOptions = {
    // TODO path.resolve
    from: file,
    to: file,
    map: false,
    ...processOptionsFromConfig,
    ...processOptionsFromOptions,
  };

  let needExecute = false;

  if (typeof processOptions.parser === 'string') {
    // TODO respect the `syntax` option too or remove this options
    if (processOptions.parser === 'postcss-js') {
      needExecute = true;
    }

    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      processOptions.parser = require(processOptions.parser);
    } catch (error) {
      loaderContext.emitError(
        new Error(
          `Loading PostCSS "${processOptions.parser}" parser failed: ${error.message}\n\n(@${file})`
        )
      );
    }
  }

  if (typeof processOptions.stringifier === 'string') {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      processOptions.stringifier = require(processOptions.stringifier);
    } catch (error) {
      loaderContext.emitError(
        new Error(
          `Loading PostCSS "${processOptions.stringifier}" stringifier failed: ${error.message}\n\n(@${file})`
        )
      );
    }
  }

  if (typeof processOptions.syntax === 'string') {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      processOptions.syntax = require(processOptions.syntax);
    } catch (error) {
      loaderContext.emitError(
        new Error(
          `Loading PostCSS "${processOptions.syntax}" syntax failed: ${error.message}\n\n(@${file})`
        )
      );
    }
  }

  return { plugins, processOptions, needExecute };
}

const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;
const ABSOLUTE_SCHEME = /^[a-z0-9+\-.]+:/i;

function getURLType(source) {
  if (source[0] === '/') {
    if (source[1] === '/') {
      return 'scheme-relative';
    }

    return 'path-absolute';
  }

  if (IS_NATIVE_WIN32_PATH.test(source)) {
    return 'path-absolute';
  }

  return ABSOLUTE_SCHEME.test(source) ? 'absolute' : 'path-relative';
}

function normalizeSourceMap(map, resourcePath) {
  let newMap = map;

  // Some loader emit source map as string
  // Strip any JSON XSSI avoidance prefix from the string (as documented in the source maps specification), and then parse the string as JSON.
  if (typeof newMap === 'string') {
    newMap = JSON.parse(newMap);
  }

  delete newMap.file;

  const { sourceRoot } = newMap;

  delete newMap.sourceRoot;

  if (newMap.sources) {
    newMap.sources = newMap.sources.map((source) => {
      const sourceType = getURLType(source);

      // Do no touch `scheme-relative` and `absolute` URLs
      if (sourceType === 'path-relative' || sourceType === 'path-absolute') {
        const absoluteSource =
          sourceType === 'path-relative' && sourceRoot
            ? path.resolve(sourceRoot, path.normalize(source))
            : path.normalize(source);

        return path.relative(path.dirname(resourcePath), absoluteSource);
      }

      return source;
    });
  }

  return newMap;
}

function normalizeSourceMapAfterPostcss(map, resourcePath) {
  const newMap = map;

  // result.map.file is an optional property that provides the output filename.
  // Since we don't know the final filename in the webpack build chain yet, it makes no sense to have it.
  // eslint-disable-next-line no-param-reassign
  delete newMap.file;

  // eslint-disable-next-line no-param-reassign
  newMap.sourceRoot = '';

  // eslint-disable-next-line no-param-reassign
  newMap.sources = newMap.sources.map((source) => {
    if (source.indexOf('<') === 0) {
      return source;
    }

    const sourceType = getURLType(source);

    // Do no touch `scheme-relative`, `path-absolute` and `absolute` types
    if (sourceType === 'path-relative') {
      const dirname = path.dirname(resourcePath);

      return path.resolve(dirname, source);
    }

    return source;
  });

  return newMap;
}

export {
  loadConfig,
  getPostcssOptions,
  exec,
  normalizeSourceMap,
  normalizeSourceMapAfterPostcss,
};
