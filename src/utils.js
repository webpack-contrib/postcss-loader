import path from 'path';

import Module from 'module';

import postcssPkg from 'postcss/package.json';
import { cosmiconfig } from 'cosmiconfig';

const parentModule = module;
const moduleName = 'postcss';

const stat = (inputFileSystem, filePath) =>
  new Promise((resolve, reject) => {
    inputFileSystem.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      }
      resolve(stats);
    });
  });

const createContext = (context) => {
  const result = {
    cwd: process.cwd(),
    env: process.env.NODE_ENV,
    ...context,
  };

  if (!result.env) {
    process.env.NODE_ENV = 'development';
  }

  return result;
};

const load = (plugin, options, file) => {
  try {
    if (
      options === null ||
      typeof options === 'undefined' ||
      Object.keys(options).length === 0
    ) {
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
};

function loadPlugins(pluginEntry, file) {
  let plugins = [];

  if (Array.isArray(pluginEntry)) {
    plugins = pluginEntry.filter(Boolean);
  } else {
    plugins = Object.entries(pluginEntry).filter((i) => {
      const [, options] = i;

      return options !== false ? pluginEntry : '';
    });
  }

  plugins = plugins.map((plugin) => {
    const [pluginName, pluginOptions] = plugin;

    return load(pluginName, pluginOptions, file);
  });

  if (plugins.length && plugins.length > 0) {
    plugins.forEach((plugin, i) => {
      if (plugin.postcss) {
        // eslint-disable-next-line no-param-reassign
        plugin = plugin.postcss;
      }

      if (plugin.default) {
        // eslint-disable-next-line no-param-reassign
        plugin = plugin.default;
      }

      if (
        // eslint-disable-next-line
        !(
          (typeof plugin === 'object' && Array.isArray(plugin.plugins)) ||
          typeof plugin === 'function'
        )
      ) {
        throw new TypeError(
          `Invalid PostCSS Plugin found at: plugins[${i}]\n\n(@${file})`
        );
      }
    });
  }

  return plugins;
}

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

async function loadConfig(config, context, configPath, loaderContext) {
  let searchPath = configPath ? path.resolve(configPath) : process.cwd();

  if (typeof config === 'string') {
    searchPath = path.resolve(config);
  }

  let stats;

  try {
    stats = await stat(loaderContext.fs, searchPath);
  } catch (errorIgnore) {
    throw new Error(`No PostCSS Config found in: ${searchPath}`);
  }

  const explorer = cosmiconfig(moduleName);

  let result;

  try {
    if (stats.isFile()) {
      result = await explorer.load(searchPath);
    } else {
      result = await explorer.search(searchPath);
    }
  } catch (errorIgnore) {
    throw new Error(`No PostCSS Config found in: ${searchPath}`);
  }

  const patchedContext = createContext(context);

  let resultConfig = result.config || {};

  if (typeof resultConfig === 'function') {
    resultConfig = resultConfig(patchedContext);
  } else {
    resultConfig = Object.assign({}, resultConfig, patchedContext);
  }

  if (!resultConfig.plugins) {
    resultConfig.plugins = [];
  }

  if (result.filepath) {
    resultConfig.file = result.filepath;
    loaderContext.addDependency(result.filepath);
  }

  return resultConfig;
}

function createPostCssPlugins(items, file) {
  function iterator(plugins, plugin, acc) {
    if (typeof plugin === 'undefined') {
      return acc;
    }

    if (plugin === false) {
      return iterator(plugins, plugins.pop(), acc);
    }

    if (plugin.postcssVersion === postcssPkg.version) {
      acc.push(plugin);
      return iterator(plugins, plugins.pop(), acc);
    }

    if (typeof plugin === 'function') {
      const postcssPlugin = plugin.call(this, this);

      if (Array.isArray(postcssPlugin)) {
        acc.concat(postcssPlugin);
      } else {
        acc.push(postcssPlugin);
      }

      return iterator(plugins, plugins.pop(), acc);
    }

    if (Object.keys(plugin).length === 0) {
      return iterator(plugins, plugins.pop(), acc);
    }

    const concatPlugins = [...plugins, ...loadPlugins(plugin, file)];

    return iterator(concatPlugins, concatPlugins.pop(), acc);
  }

  const pl = [...items];

  return iterator(pl, pl.pop(), []);
}

export { exec, loadConfig, createPostCssPlugins };
