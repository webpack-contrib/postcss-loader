/* eslint-disable global-require */

import path from 'path';

import { loadConfig } from '../src/utils';

const testDirectory = path.resolve(__dirname, 'fixtures', 'config-autoload');

describe('config-autoload', () => {
  const ctx = {
    parser: true,
    syntax: true,
  };

  it('.postcssrc - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.options.parser).toEqual(require('sugarss'));
      expect(config.options.syntax).toEqual(require('sugarss'));
      expect(config.options.map).toEqual(false);
      expect(config.options.from).toEqual('./test/rc/fixtures/index.css');
      expect(config.options.to).toEqual('./test/rc/expect/index.css');

      expect(config.plugins.length).toEqual(2);
      expect(typeof config.plugins[0]).toBe('function');
      expect(typeof config.plugins[1]).toBe('function');

      expect(config.file).toEqual(
        path.resolve(testDirectory, 'rc', '.postcssrc')
      );
    };

    const config = await loadConfig(
      null,
      {},
      path.resolve(testDirectory, 'rc')
    );

    expected(config);
  });

  it('postcss.config.js - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.options.parser).toEqual(require('sugarss'));
      expect(config.options.syntax).toEqual(require('sugarss'));
      expect(config.options.map).toEqual(false);
      expect(config.options.from).toEqual(
        './test/js/object/fixtures/index.css'
      );
      expect(config.options.to).toEqual('./test/js/object/expect/index.css');

      expect(config.plugins.length).toEqual(2);
      expect(typeof config.plugins[0]).toBe('function');
      expect(typeof config.plugins[1]).toBe('function');

      expect(config.file).toEqual(
        path.resolve(testDirectory, 'js/object', 'postcss.config.js')
      );
    };

    const config = await loadConfig(
      null,
      ctx,
      path.resolve(testDirectory, 'js/object')
    );

    expected(config);
  });

  it('postcss.config.js - {Array} - Load Config', async () => {
    const expected = (config) => {
      expect(config.options.parser).toEqual(require('sugarss'));
      expect(config.options.syntax).toEqual(require('sugarss'));
      expect(config.options.map).toEqual(false);
      expect(config.options.from).toEqual('./test/js/array/fixtures/index.css');
      expect(config.options.to).toEqual('./test/js/array/expect/index.css');

      expect(config.plugins.length).toEqual(2);
      expect(typeof config.plugins[0]).toBe('function');
      expect(typeof config.plugins[1]).toBe('function');

      expect(config.file).toEqual(
        path.resolve(testDirectory, 'js/array', 'postcss.config.js')
      );
    };

    const config = await loadConfig(
      null,
      ctx,
      path.resolve(testDirectory, 'js/array')
    );

    expected(config);
  });

  it('package.json - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.options.parser).toEqual(false);
      expect(config.options.syntax).toEqual(false);
      expect(config.options.map).toEqual(false);
      expect(config.options.from).toEqual('./test/pkg/fixtures/index.css');
      expect(config.options.to).toEqual('./test/pkg/expect/index.css');

      expect(config.plugins.length).toEqual(2);
      expect(typeof config.plugins[0]).toBe('function');
      expect(typeof config.plugins[1]).toBe('function');

      expect(config.file).toEqual(
        path.resolve(testDirectory, 'pkg', 'package.json')
      );
    };

    const config = await loadConfig(
      null,
      {},
      path.resolve(testDirectory, 'pkg')
    );

    expected(config);
  });

  it('Loading Config - {Error}', async () => {
    try {
      await loadConfig(null, {}, path.resolve('unresolved'));
    } catch (error) {
      expect(error.message).toMatch(/^No PostCSS Config found in: (.*)$/);
    }
  });

  it('Plugin - {Type} - Invalid', async () => {
    try {
      await loadConfig(null, {}, path.resolve(testDirectory, 'err/plugins'));
    } catch (error) {
      expect(error.message).toMatch(
        /^Invalid PostCSS Plugin found at: (.*)\n\n\(@.*\)$/
      );
    }
  });

  it('Loading Plugin - {Object} - {Error}', async () => {
    try {
      await loadConfig(
        null,
        {},
        path.resolve(testDirectory, 'err/plugins/object')
      );
    } catch (error) {
      expect(error.message).toMatch(/^Loading PostCSS Plugin failed: .*$/m);
    }
  });

  it('Loading Plugin - {Object} - Options - {Error}', async () => {
    try {
      await loadConfig(
        null,
        {},
        path.resolve(testDirectory, 'err/plugins/object/options')
      );
    } catch (error) {
      expect(error.message).toMatch(/^Loading PostCSS Plugin failed: .*$/m);
    }
  });

  it('Loading Plugin - {Array} - {Error}', async () => {
    try {
      await loadConfig(
        null,
        {},
        path.resolve(testDirectory, 'err/plugins/array')
      );
    } catch (error) {
      expect(error.message).toMatch(/^Cannot find (.*)$/);
    }
  });

  it('Loading Plugin - {Array} - Options - {Error}', async () => {
    try {
      await loadConfig(
        null,
        {},
        path.resolve(testDirectory, 'err/plugins/array/options')
      );
    } catch (error) {
      expect(error.message).toMatch(/^Cannot find (.*)$/);
    }
  });
});

describe('Loading Options - {Error}', () => {
  it('Parser - {String}', async () => {
    try {
      await loadConfig(
        null,
        {},
        path.resolve(testDirectory, 'err/options/parser')
      );
    } catch (error) {
      expect(error.message).toMatch(/^Loading PostCSS Parser failed: .*$/m);
    }
  });

  it('Syntax - {String}', async () => {
    try {
      await loadConfig(
        null,
        {},
        path.resolve(testDirectory, 'err/options/syntax')
      );
    } catch (error) {
      expect(error.message).toMatch(/^Loading PostCSS Syntax failed: .*$/m);
    }
  });

  it('Stringifier - {String}', async () => {
    try {
      await loadConfig(
        null,
        {},
        path.resolve(testDirectory, 'err/options/stringifier')
      );
    } catch (error) {
      expect(error.message).toMatch(
        /^Loading PostCSS Stringifier failed: .*$/m
      );
    }
  });
});
