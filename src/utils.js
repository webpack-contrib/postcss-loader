import path from 'path';

import Module from 'module';

import { cosmiconfig } from 'cosmiconfig';
import importCwd from 'import-cwd';

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

const loadOptions = (config, file) => {
  const result = {};

  if (config.parser && typeof config.parser === 'string') {
    try {
      result.parser = importCwd(config.parser);
    } catch (err) {
      throw new Error(
        `Loading PostCSS Parser failed: ${err.message}\n\n(@${file})`
      );
    }
  }

  if (config.syntax && typeof config.syntax === 'string') {
    try {
      result.syntax = importCwd(config.syntax);
    } catch (err) {
      throw new Error(
        `Loading PostCSS Syntax failed: ${err.message}\n\n(@${file})`
      );
    }
  }

  if (config.stringifier && typeof config.stringifier === 'string') {
    try {
      result.stringifier = importCwd(config.stringifier);
    } catch (err) {
      throw new Error(
        `Loading PostCSS Stringifier failed: ${err.message}\n\n(@${file})`
      );
    }
  }

  if (config.plugins) {
    // eslint-disable-next-line no-param-reassign
    delete config.plugins;
  }

  return { ...config, ...result };
};

const load = (plugin, options, file) => {
  try {
    if (
      options === null ||
      typeof options === 'undefined' ||
      Object.keys(options).length === 0
    ) {
      return importCwd(plugin);
    }

    return importCwd(plugin)(options);
  } catch (err) {
    throw new Error(
      `Loading PostCSS Plugin failed: ${err.message}\n\n(@${file})`
    );
  }
};

const loadPlugins = (config, file) => {
  let plugins = [];

  if (Array.isArray(config.plugins)) {
    plugins = config.plugins.filter(Boolean);
  } else {
    plugins = Object.keys(config.plugins)
      .filter((plugin) => {
        return config.plugins[plugin] !== false ? plugin : '';
      })
      .map((plugin) => {
        return load(plugin, config.plugins[plugin], file);
      });
  }

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
};

const processResult = (context, result) => {
  const file = result.filepath || '';
  let config = result.config || {};

  if (typeof config === 'function') {
    config = config(context);
  } else {
    config = Object.assign({}, config, context);
  }

  if (!config.plugins) {
    config.plugins = [];
  }

  return {
    plugins: loadPlugins(config, file),
    options: loadOptions(config, file),
    file,
  };
};

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

async function loadConfig(config, context, configPath, inputFileSystem) {
  if (config === false) {
    return {};
  }

  let searchPath = configPath ? path.resolve(configPath) : process.cwd();

  if (typeof config === 'string') {
    searchPath = path.resolve(config);
  }

  let stats;

  try {
    stats = await stat(inputFileSystem, searchPath);
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

  return processResult(createContext(context), result);
}

export { exec, loadConfig };
