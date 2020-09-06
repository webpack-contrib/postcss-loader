import path from 'path';
import fs from 'fs';

import { loadConfig } from '../src/utils';

const testDirectory = path.resolve(__dirname, 'fixtures', 'config-autoload');

const loaderContext = {
  fs,
  addDependency: () => true,
};

describe('config-autoload', () => {
  const ctx = {
    parser: true,
    syntax: true,
  };

  it('.postcssrc - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.map).toEqual(false);
      expect(config.from).toEqual('./test/rc/fixtures/index.css');
      expect(config.to).toEqual('./test/rc/expect/index.css');
      expect(Object.keys(config.plugins).length).toEqual(3);
      expect(config.file).toEqual(
        path.resolve(testDirectory, 'rc', '.postcssrc')
      );
    };

    const config = await loadConfig(
      true,
      {},
      path.resolve(testDirectory, 'rc'),
      loaderContext
    );

    expected(config);
  });

  it('postcss.config.js - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.map).toEqual(false);
      expect(config.from).toEqual(
        './test/fixtures/config-autoload/js/object/index.css'
      );
      expect(config.to).toEqual(
        './test/fixtures/config-autoload/js/object/expect/index.css'
      );
      expect(Object.keys(config.plugins).length).toEqual(3);
      expect(config.file).toEqual(
        path.resolve(testDirectory, 'js/object', 'postcss.config.js')
      );
    };

    const config = await loadConfig(
      true,
      ctx,
      path.resolve(testDirectory, 'js/object'),
      loaderContext
    );

    expected(config);
  });

  it('postcss.config.js - {Array} - Load Config', async () => {
    const expected = (config) => {
      expect(config.map).toEqual(false);
      expect(config.from).toEqual(
        './test/fixtures/config-autoload/js/object/index.css'
      );
      expect(config.to).toEqual(
        './test/fixtures/config-autoload/js/object/expect/index.css'
      );
      expect(Object.keys(config.plugins).length).toEqual(3);
      expect(config.file).toEqual(
        path.resolve(testDirectory, 'js/array', 'postcss.config.js')
      );
    };

    const config = await loadConfig(
      true,
      ctx,
      path.resolve(testDirectory, 'js/array'),
      loaderContext
    );

    expected(config);
  });

  it('package.json - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.parser).toEqual(false);
      expect(config.syntax).toEqual(false);
      expect(config.map).toEqual(false);
      expect(config.from).toEqual(
        './test/fixtures/config-autoload/pkg/index.css'
      );
      expect(config.to).toEqual(
        './test/fixtures/config-autoload/pkg/expected/index.css'
      );
      expect(Object.keys(config.plugins).length).toEqual(3);
      expect(config.file).toEqual(
        path.resolve(testDirectory, 'pkg', 'package.json')
      );
    };

    const config = await loadConfig(
      true,
      {},
      path.resolve(testDirectory, 'pkg'),
      loaderContext
    );

    expected(config);
  });

  it('Loading Config - {Error}', async () => {
    try {
      await loadConfig(true, {}, path.resolve('unresolved'), fs);
    } catch (error) {
      expect(error.message).toMatch(/^No PostCSS Config found in: (.*)$/);
    }
  });
});
