import path from 'path';

import Module from 'module';

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

const loadOptions = (config, file) => {
  const result = {};

  if (config.parser && typeof config.parser === 'string') {
    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      result.parser = require(config.parser);
    } catch (err) {
      throw new Error(
        `Loading PostCSS Parser failed: ${err.message}\n\n(@${file})`
      );
    }
  }

  if (config.syntax && typeof config.syntax === 'string') {
    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      result.syntax = require(config.syntax);
    } catch (err) {
      throw new Error(
        `Loading PostCSS Syntax failed: ${err.message}\n\n(@${file})`
      );
    }
  }

  if (config.stringifier && typeof config.stringifier === 'string') {
    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      result.stringifier = require(config.stringifier);
    } catch (err) {
      throw new Error(
        `Loading PostCSS Stringifier failed: ${err.message}\n\n(@${file})`
      );
    }
  }

  return { ...config, ...result };
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

  resultConfig.file = result.filepath || '';

  delete resultConfig.webpack;

  const options = loadOptions(resultConfig, resultConfig.file);

  return { ...resultConfig, ...options };
}

export { exec, loadConfig };
