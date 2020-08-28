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
  const plugins = Object.entries(pluginEntry).filter((i) => {
    const [, options] = i;

    return options !== false ? pluginEntry : '';
  });

  const loadedPlugins = plugins.map((plugin) => {
    const [pluginName, pluginOptions] = plugin;

    return load(pluginName, pluginOptions, file);
  });

  if (loadedPlugins.length && loadedPlugins.length > 0) {
    loadedPlugins.forEach((plugin, i) => {
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

  return loadedPlugins;
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
  } catch (error) {
    throw error;
  }

  if (!result) {
    return {};
  }

  const patchedContext = createContext(context);

  let resultConfig = result.config || {};

  if (typeof resultConfig === 'function') {
    resultConfig = resultConfig(patchedContext);
  } else {
    resultConfig = { ...resultConfig, ...patchedContext };
  }

  if (result.filepath) {
    resultConfig.file = result.filepath;
    loaderContext.addDependency(result.filepath);
  }

  return resultConfig;
}

function getPlugin(pluginEntry) {
  if (!pluginEntry) {
    return [];
  }

  if (isPostcssPlugin(pluginEntry)) {
    return [pluginEntry];
  }

  const result = pluginEntry();

  return Array.isArray(result) ? result : [result];
}

function isPostcssPlugin(plugin) {
  return plugin.postcssVersion === postcssPkg.version;
}

function pluginsProcessing(plugins, file, disabledPlugins) {
  if (Array.isArray(plugins)) {
    return plugins.reduce((accumulator, plugin) => {
      let normalizedPlugin = plugin;

      if (Array.isArray(plugin)) {
        const [name] = plugin;
        let [, options] = plugin;

        options = options || {};

        normalizedPlugin = { [name]: options };
      }

      if (typeof plugin === 'string') {
        normalizedPlugin = { [plugin]: {} };
      }

      // eslint-disable-next-line no-param-reassign
      accumulator = accumulator.concat(
        pluginsProcessing(normalizedPlugin, file, disabledPlugins)
      );

      return accumulator;
    }, []);
  }

  if (typeof plugins === 'object') {
    if (Object.keys(plugins).length === 0) {
      return [];
    }

    const statePlagins = {
      enabled: {},
      disabled: disabledPlugins || [],
    };

    Object.entries(plugins).forEach((plugin) => {
      const [name, options] = plugin;

      if (options === false) {
        statePlagins.disabled.push(name);
      } else {
        statePlagins.enabled[name] = options;
      }
    });

    return pluginsProcessing(
      loadPlugins(statePlagins.enabled, file),
      file,
      disabledPlugins
    );
  }

  return getPlugin(plugins);
}

function getArrayPlugins(plugins, file, disabledPlugins, loaderContext) {
  if (typeof plugins === 'function') {
    if (isPostcssPlugin(plugins)) {
      return [plugins];
    }

    return pluginsProcessing(plugins(loaderContext), file, disabledPlugins);
  }

  return pluginsProcessing(plugins, file, disabledPlugins);
}

export { exec, loadConfig, getArrayPlugins };
