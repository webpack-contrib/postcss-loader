import path from 'path';
import fs from 'fs';

import { loadConfig } from '../src/utils';

const testDirectory = path.resolve(__dirname, 'fixtures', 'config-autoload');

const loaderContext = {
  fs,
  addDependency: () => true,
};

describe('autoload config', () => {
  it('should load ".postcssrc"', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, 'rc')
    );

    expect(loadedConfig.config.map).toEqual(false);
    expect(loadedConfig.config.from).toEqual('./test/rc/fixtures/index.css');
    expect(loadedConfig.config.to).toEqual('./test/rc/expect/index.css');
    expect(Object.keys(loadedConfig.config.plugins).length).toEqual(2);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, 'rc', '.postcssrc')
    );
  });

  it('should load "package.json"', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, 'pkg')
    );

    expect(loadedConfig.config.parser).toEqual(false);
    expect(loadedConfig.config.syntax).toEqual(false);
    expect(loadedConfig.config.map).toEqual(false);
    expect(loadedConfig.config.from).toEqual('./index.css');
    expect(loadedConfig.config.to).toEqual('./index.css');
    expect(Object.keys(loadedConfig.config.plugins).length).toEqual(2);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, 'pkg', 'package.json')
    );
  });

  it('should load "postcss.config.js" with "Object" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, 'js/object')
    );

    expect(loadedConfig.config.map).toEqual(false);
    expect(loadedConfig.config.from).toEqual(
      './test/fixtures/config-autoload/js/object/index.css'
    );
    expect(loadedConfig.config.to).toEqual(
      './test/fixtures/config-autoload/js/object/expect/index.css'
    );
    expect(Object.keys(loadedConfig.config.plugins).length).toEqual(2);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, 'js/object', 'postcss.config.js')
    );
  });

  it('should load "postcss.config.js" with "Array" syntax of plugins', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, 'js/array')
    );

    expect(loadedConfig.config.map).toEqual(false);
    expect(loadedConfig.config.from).toEqual(
      './test/fixtures/config-autoload/js/object/index.css'
    );
    expect(loadedConfig.config.to).toEqual(
      './test/fixtures/config-autoload/js/object/expect/index.css'
    );
    expect(Object.keys(loadedConfig.config.plugins).length).toEqual(4);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, 'js/array', 'postcss.config.js')
    );
  });

  it('should load empty ".postcssrc"', async () => {
    const loadedConfig = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, 'empty/.postcssrc')
    );

    // eslint-disable-next-line no-undefined
    expect(loadedConfig.config).toEqual(undefined);
    expect(loadedConfig.filepath).toEqual(
      path.resolve(testDirectory, 'empty/.postcssrc')
    );
  });

  it('should throw an error on "unresolved" config', async () => {
    try {
      await loadConfig(loaderContext, path.resolve('unresolved'));
    } catch (error) {
      expect(error.message).toMatch(/^No PostCSS config found in: (.*)$/);
    }
  });
});
