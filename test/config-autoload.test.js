import path from 'path';
import fs from 'fs';

import { loadConfig } from '../src/utils';

const testDirectory = path.resolve(__dirname, 'fixtures', 'config-autoload');

const loaderContext = {
  fs,
  addDependency: () => true,
};

describe('autoload config', () => {
  it('.postcssrc', async () => {
    const expected = (config) => {
      expect(config.map).toEqual(false);
      expect(config.from).toEqual('./test/rc/fixtures/index.css');
      expect(config.to).toEqual('./test/rc/expect/index.css');
      expect(Object.keys(config.plugins).length).toEqual(2);
      expect(config.file).toEqual(
        path.resolve(testDirectory, 'rc', '.postcssrc')
      );
    };

    const config = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, 'rc')
    );

    expected(config);
  });

  it('postcss.config.js using the "object" syntax of plugins', async () => {
    const expected = (config) => {
      expect(config.map).toEqual(false);
      expect(config.from).toEqual(
        './test/fixtures/config-autoload/js/object/index.css'
      );
      expect(config.to).toEqual(
        './test/fixtures/config-autoload/js/object/expect/index.css'
      );
      expect(Object.keys(config.plugins).length).toEqual(2);
      expect(config.file).toEqual(
        path.resolve(testDirectory, 'js/object', 'postcss.config.js')
      );
    };

    const config = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, 'js/object')
    );

    expected(config);
  });

  it('postcss.config.js using the "array" syntax of plugins', async () => {
    const expected = (config) => {
      expect(config.map).toEqual(false);
      expect(config.from).toEqual(
        './test/fixtures/config-autoload/js/object/index.css'
      );
      expect(config.to).toEqual(
        './test/fixtures/config-autoload/js/object/expect/index.css'
      );
      expect(Object.keys(config.plugins).length).toEqual(2);
      expect(config.file).toEqual(
        path.resolve(testDirectory, 'js/array', 'postcss.config.js')
      );
    };

    const config = await loadConfig(
      loaderContext,
      path.resolve(testDirectory, 'js/array')
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
      loaderContext,
      path.resolve(testDirectory, 'pkg')
    );

    expected(config);
  });

  it('Loading Config - {Error}', async () => {
    try {
      await loadConfig(loaderContext, path.resolve('unresolved'));
    } catch (error) {
      expect(error.message).toMatch(/^No PostCSS Config found in: (.*)$/);
    }
  });
});
