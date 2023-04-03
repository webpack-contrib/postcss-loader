import path from "path";
import url from "url";
import Module from "module";

import { klona } from "klona/full";
import { cosmiconfig, defaultLoaders } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";

import SyntaxError from "./Error";

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

async function loadConfig(loaderContext, config, postcssOptions) {
  const searchPath =
    typeof config === "string"
      ? path.resolve(config)
      : path.dirname(loaderContext.resourcePath);

  let stats;

  try {
    stats = await stat(loaderContext.fs, searchPath);
  } catch (errorIgnore) {
    throw new Error(`No PostCSS config found in: ${searchPath}`);
  }

  let isTsNodeInstalled = false;

  try {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    require("ts-node");

    isTsNodeInstalled = true;
  } catch (_) {
    // Nothing
  }

  const moduleName = "postcss";
  const searchPlaces = isTsNodeInstalled
    ? [
        "package.json",
        `.${moduleName}rc`,
        `.${moduleName}rc.json`,
        `.${moduleName}rc.yaml`,
        `.${moduleName}rc.yml`,
        `.${moduleName}rc.js`,
        `.${moduleName}rc.mjs`,
        `.${moduleName}rc.cjs`,
        `.${moduleName}rc.ts`,
        `.${moduleName}rc.mts`,
        `.${moduleName}rc.cts`,
        `.config/${moduleName}rc`,
        `.config/${moduleName}rc.json`,
        `.config/${moduleName}rc.yaml`,
        `.config/${moduleName}rc.yml`,
        `.config/${moduleName}rc.js`,
        `.config/${moduleName}rc.mjs`,
        `.config/${moduleName}rc.cjs`,
        `.config/${moduleName}rc.ts`,
        `.config/${moduleName}rc.mts`,
        `.config/${moduleName}rc.cts`,
        `${moduleName}.config.js`,
        `${moduleName}.config.mjs`,
        `${moduleName}.config.cjs`,
        `${moduleName}.config.ts`,
        `${moduleName}.config.mts`,
        `${moduleName}.config.cts`,
      ]
    : [
        "package.json",
        `.${moduleName}rc`,
        `.${moduleName}rc.json`,
        `.${moduleName}rc.yaml`,
        `.${moduleName}rc.yml`,
        `.${moduleName}rc.js`,
        `.${moduleName}rc.mjs`,
        `.${moduleName}rc.cjs`,
        `.config/${moduleName}rc`,
        `.config/${moduleName}rc.json`,
        `.config/${moduleName}rc.yaml`,
        `.config/${moduleName}rc.yml`,
        `.config/${moduleName}rc.js`,
        `.config/${moduleName}rc.mjs`,
        `.config/${moduleName}rc.cjs`,
        `${moduleName}.config.js`,
        `${moduleName}.config.mjs`,
        `${moduleName}.config.cjs`,
      ];

  const loaders = {
    ".js": async (...args) => {
      let result;

      try {
        result = defaultLoaders[".js"](...args);
      } catch (error) {
        let importESM;

        try {
          // eslint-disable-next-line no-new-func
          importESM = new Function("id", "return import(id);");
        } catch (e) {
          importESM = null;
        }

        if (
          error.code === "ERR_REQUIRE_ESM" &&
          url.pathToFileURL &&
          importESM
        ) {
          const urlForConfig = url.pathToFileURL(args[0]);

          result = await importESM(urlForConfig);
        } else {
          throw error;
        }
      }

      return result;
    },
    ".mjs": async (...args) => {
      let result;
      let importESM;

      try {
        // eslint-disable-next-line no-new-func
        importESM = new Function("id", "return import(id);");
      } catch (e) {
        importESM = null;
      }

      if (url.pathToFileURL && importESM) {
        const urlForConfig = url.pathToFileURL(args[0]);

        result = await importESM(urlForConfig);
      } else {
        throw new Error("ESM is not supported");
      }

      return result;
    },
  };

  if (isTsNodeInstalled) {
    loaders[".cts"] = TypeScriptLoader();
    loaders[".mts"] = TypeScriptLoader();
    loaders[".ts"] = TypeScriptLoader();
  }

  const explorer = cosmiconfig(moduleName, {
    searchPlaces,
    loaders,
  });

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

  loaderContext.addBuildDependency(result.filepath);
  loaderContext.addDependency(result.filepath);

  if (result.isEmpty) {
    return result;
  }

  if (typeof result.config === "function") {
    const api = {
      mode: loaderContext.mode,
      file: loaderContext.resourcePath,
      // For complex use
      webpackLoaderContext: loaderContext,
      // Partial compatibility with `postcss-cli`
      env: loaderContext.mode,
      options: postcssOptions || {},
    };

    result.config = result.config(api);
  }

  result = klona(result);

  return result;
}

function loadPlugin(plugin, options, file) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    let loadedPlugin = require(plugin);

    if (loadedPlugin.default) {
      loadedPlugin = loadedPlugin.default;
    }

    if (!options || Object.keys(options).length === 0) {
      return loadedPlugin;
    }

    return loadedPlugin(options);
  } catch (error) {
    throw new Error(
      `Loading PostCSS "${plugin}" plugin failed: ${error.message}\n\n(@${file})`
    );
  }
}

function pluginFactory() {
  const listOfPlugins = new Map();

  return (plugins) => {
    if (typeof plugins === "undefined") {
      return listOfPlugins;
    }

    if (Array.isArray(plugins)) {
      for (const plugin of plugins) {
        if (Array.isArray(plugin)) {
          const [name, options] = plugin;

          listOfPlugins.set(name, options);
        } else if (plugin && typeof plugin === "function") {
          listOfPlugins.set(plugin);
        } else if (
          plugin &&
          Object.keys(plugin).length === 1 &&
          (typeof plugin[Object.keys(plugin)[0]] === "object" ||
            typeof plugin[Object.keys(plugin)[0]] === "boolean") &&
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

async function tryRequireThenImport(module) {
  let exports;

  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    exports = require(module);

    return exports;
  } catch (requireError) {
    let importESM;

    try {
      // eslint-disable-next-line no-new-func
      importESM = new Function("id", "return import(id);");
    } catch (e) {
      importESM = null;
    }

    if (requireError.code === "ERR_REQUIRE_ESM" && importESM) {
      exports = await importESM(module);

      return exports.default;
    }

    throw requireError;
  }
}

async function getPostcssOptions(
  loaderContext,
  loadedConfig = {},
  postcssOptions = {}
) {
  const file = loaderContext.resourcePath;

  let normalizedPostcssOptions = postcssOptions;

  if (typeof normalizedPostcssOptions === "function") {
    normalizedPostcssOptions = normalizedPostcssOptions(loaderContext);
  }

  let plugins = [];

  try {
    const factory = pluginFactory();

    if (loadedConfig.config && loadedConfig.config.plugins) {
      factory(loadedConfig.config.plugins);
    }

    factory(normalizedPostcssOptions.plugins);

    plugins = [...factory()].map((item) => {
      const [plugin, options] = item;

      if (typeof plugin === "string") {
        return loadPlugin(plugin, options, file);
      }

      return plugin;
    });
  } catch (error) {
    loaderContext.emitError(error);
  }

  const processOptionsFromConfig = loadedConfig.config || {};

  if (processOptionsFromConfig.from) {
    processOptionsFromConfig.from = path.resolve(
      path.dirname(loadedConfig.filepath),
      processOptionsFromConfig.from
    );
  }

  if (processOptionsFromConfig.to) {
    processOptionsFromConfig.to = path.resolve(
      path.dirname(loadedConfig.filepath),
      processOptionsFromConfig.to
    );
  }

  // No need them for processOptions
  delete processOptionsFromConfig.plugins;

  const processOptionsFromOptions = klona(normalizedPostcssOptions);

  if (processOptionsFromOptions.from) {
    processOptionsFromOptions.from = path.resolve(
      loaderContext.rootContext,
      processOptionsFromOptions.from
    );
  }

  if (processOptionsFromOptions.to) {
    processOptionsFromOptions.to = path.resolve(
      loaderContext.rootContext,
      processOptionsFromOptions.to
    );
  }

  // No need them for processOptions
  delete processOptionsFromOptions.config;
  delete processOptionsFromOptions.plugins;

  const processOptions = {
    from: file,
    to: file,
    map: false,
    ...processOptionsFromConfig,
    ...processOptionsFromOptions,
  };

  if (typeof processOptions.parser === "string") {
    try {
      processOptions.parser = await tryRequireThenImport(processOptions.parser);
    } catch (error) {
      loaderContext.emitError(
        new Error(
          `Loading PostCSS "${processOptions.parser}" parser failed: ${error.message}\n\n(@${file})`
        )
      );
    }
  }

  if (typeof processOptions.stringifier === "string") {
    try {
      processOptions.stringifier = await tryRequireThenImport(
        processOptions.stringifier
      );
    } catch (error) {
      loaderContext.emitError(
        new Error(
          `Loading PostCSS "${processOptions.stringifier}" stringifier failed: ${error.message}\n\n(@${file})`
        )
      );
    }
  }

  if (typeof processOptions.syntax === "string") {
    try {
      processOptions.syntax = await tryRequireThenImport(processOptions.syntax);
    } catch (error) {
      loaderContext.emitError(
        new Error(
          `Loading PostCSS "${processOptions.syntax}" syntax failed: ${error.message}\n\n(@${file})`
        )
      );
    }
  }

  if (processOptions.map === true) {
    // https://github.com/postcss/postcss/blob/master/docs/source-maps.md
    processOptions.map = { inline: true };
  }

  return { plugins, processOptions };
}

const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;
const ABSOLUTE_SCHEME = /^[a-z0-9+\-.]+:/i;

function getURLType(source) {
  if (source[0] === "/") {
    if (source[1] === "/") {
      return "scheme-relative";
    }

    return "path-absolute";
  }

  if (IS_NATIVE_WIN32_PATH.test(source)) {
    return "path-absolute";
  }

  return ABSOLUTE_SCHEME.test(source) ? "absolute" : "path-relative";
}

function normalizeSourceMap(map, resourceContext) {
  let newMap = map;

  // Some loader emit source map as string
  // Strip any JSON XSSI avoidance prefix from the string (as documented in the source maps specification), and then parse the string as JSON.
  if (typeof newMap === "string") {
    newMap = JSON.parse(newMap);
  }

  delete newMap.file;

  const { sourceRoot } = newMap;

  delete newMap.sourceRoot;

  if (newMap.sources) {
    newMap.sources = newMap.sources.map((source) => {
      const sourceType = getURLType(source);

      // Do no touch `scheme-relative` and `absolute` URLs
      if (sourceType === "path-relative" || sourceType === "path-absolute") {
        const absoluteSource =
          sourceType === "path-relative" && sourceRoot
            ? path.resolve(sourceRoot, path.normalize(source))
            : path.normalize(source);

        return path.relative(resourceContext, absoluteSource);
      }

      return source;
    });
  }

  return newMap;
}

function normalizeSourceMapAfterPostcss(map, resourceContext) {
  const newMap = map;

  // result.map.file is an optional property that provides the output filename.
  // Since we don't know the final filename in the webpack build chain yet, it makes no sense to have it.
  // eslint-disable-next-line no-param-reassign
  delete newMap.file;

  // eslint-disable-next-line no-param-reassign
  newMap.sourceRoot = "";

  // eslint-disable-next-line no-param-reassign
  newMap.sources = newMap.sources.map((source) => {
    if (source.indexOf("<") === 0) {
      return source;
    }

    const sourceType = getURLType(source);

    // Do no touch `scheme-relative`, `path-absolute` and `absolute` types
    if (sourceType === "path-relative") {
      return path.resolve(resourceContext, source);
    }

    return source;
  });

  return newMap;
}

function findPackageJSONDir(cwd, statSync) {
  let dir = cwd;

  for (;;) {
    try {
      if (statSync(path.join(dir, "package.json")).isFile()) {
        break;
      }
    } catch (error) {
      // Nothing
    }

    const parent = path.dirname(dir);

    if (dir === parent) {
      dir = null;
      break;
    }

    dir = parent;
  }

  return dir;
}

function getPostcssImplementation(loaderContext, implementation) {
  let resolvedImplementation = implementation;

  if (!implementation || typeof implementation === "string") {
    const postcssImplPkg = implementation || "postcss";

    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      resolvedImplementation = require(postcssImplPkg);
    } catch (error) {
      loaderContext.emitError(error);

      // eslint-disable-next-line consistent-return
      return;
    }
  }

  // eslint-disable-next-line consistent-return
  return resolvedImplementation;
}

function reportError(loaderContext, callback, error) {
  if (error.file) {
    loaderContext.addDependency(error.file);
  }

  if (error.name === "CssSyntaxError") {
    callback(new SyntaxError(error));
  } else {
    callback(error);
  }
}

export {
  loadConfig,
  getPostcssOptions,
  exec,
  normalizeSourceMap,
  normalizeSourceMapAfterPostcss,
  findPackageJSONDir,
  getPostcssImplementation,
  reportError,
};
