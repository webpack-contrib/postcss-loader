import fs from "node:fs";
import path from "node:path";

import { loadConfig } from "../src/utils";

const testDirectory = path.resolve(__dirname, "fixtures", "config-autoload");

const loaderContext = {
  fs,
  addBuildDependency: () => true,
  addDependency: () => true,
};

describe("autoload config", () => {
  it('should load ".postcssrc"', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "rc"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe("./test/rc/fixtures/index.css");
    expect(loadedConfig.config.to).toBe("./test/rc/expect/index.css");
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(2);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "rc", ".postcssrc"),
    );
  });

  it('should load ".postcssrc.js"', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "rc-js"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe("./test/rc-js/fixtures/index.css");
    expect(loadedConfig.config.to).toBe("./test/rc-js/expect/index.css");
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(2);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "rc-js", ".postcssrc.js"),
    );
  });

  it('should load "package.json"', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "pkg"),
    );

    expect(loadedConfig.config.parser).toBe(false);
    expect(loadedConfig.config.syntax).toBe(false);
    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe("./index.css");
    expect(loadedConfig.config.to).toBe("./index.css");
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(2);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "pkg", "package.json"),
    );
  });

  it('should load "postcss.config.js" with "Object" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "js/object"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe(
      "./test/fixtures/config-autoload/js/object/index.css",
    );
    expect(loadedConfig.config.to).toBe(
      "./test/fixtures/config-autoload/js/object/expect/index.css",
    );
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(2);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "js/object", "postcss.config.js"),
    );
  });

  it('should load "postcss.config.cts" with "Object" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "ts/object"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe(
      "./test/fixtures/config-autoload/ts/object/index.css",
    );
    expect(loadedConfig.config.to).toBe(
      "./test/fixtures/config-autoload/ts/object/expect/index.css",
    );
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(2);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "ts/object", "postcss.config.ts"),
    );
  });

  it('should load "postcss.config.js" with "Array" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "js/array"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe(
      "./test/fixtures/config-autoload/js/object/index.css",
    );
    expect(loadedConfig.config.to).toBe(
      "./test/fixtures/config-autoload/js/object/expect/index.css",
    );
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(4);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "js/array", "postcss.config.js"),
    );
  });

  it('should load ESM version of "postcss.config.js" with "Array" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "js/array-esm-js"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe(
      "./test/fixtures/config-autoload/js/object/index.css",
    );
    expect(loadedConfig.config.to).toBe(
      "./test/fixtures/config-autoload/js/object/expect/index.css",
    );
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(4);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "js/array-esm-js", "postcss.config.js"),
    );
  });

  // TODO Test manually with NODE_OPTIONS=--experimental-vm-modules to enable ESM support in jest
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should load "postcss.config.mjs" with "Array" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "js/array-mjs"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe(
      "./test/fixtures/config-autoload/js/object/index.css",
    );
    expect(loadedConfig.config.to).toBe(
      "./test/fixtures/config-autoload/js/object/expect/index.css",
    );
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(4);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "js/array-mjs", "postcss.config.mjs"),
    );
  });

  it('should load "postcss.config.ts" with "Array" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "ts/array"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe(
      "./test/fixtures/config-autoload/ts/object/index.css",
    );
    expect(loadedConfig.config.to).toBe(
      "./test/fixtures/config-autoload/ts/object/expect/index.css",
    );
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(4);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "ts/array", "postcss.config.ts"),
    );
  });

  it('should load "postcss.config.mts" with "Array" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "ts/array-mts"),
    );

    expect(loadedConfig.config.map).toBe(false);
    expect(loadedConfig.config.from).toBe(
      "./test/fixtures/config-autoload/ts/object/index.css",
    );
    expect(loadedConfig.config.to).toBe(
      "./test/fixtures/config-autoload/ts/object/expect/index.css",
    );
    expect(Object.keys(loadedConfig.config.plugins)).toHaveLength(4);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "ts/array-mts", "postcss.config.mts"),
    );
  });

  it('should load empty ".postcssrc"', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, "empty/.postcssrc"),
    );

    expect(loadedConfig.config).toBeUndefined();
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, "empty/.postcssrc"),
    );
  });

  it('should throw an error on "unresolved" config', async () => {
    try {
      await loadConfig(loaderContext, path.resolve("unresolved"));
    } catch (error) {
      expect(error.message).toMatch(/^No PostCSS config found in: (.*)$/);
    }
  });
});
