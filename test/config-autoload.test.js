/* eslint-disable global-require */

import path from 'path';
import fs from 'fs';

import { loadConfig } from '../src/utils';

const testDirectory = path.resolve(__dirname, 'fixtures', 'config-autoload');

describe('config-autoload', () => {
  const ctx = {
    parser: true,
    syntax: true,
  };

  it('.postcssrc - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.parser).toEqual(require('sugarss'));
      expect(config.syntax).toEqual(require('sugarss'));
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
      fs
    );

    expected(config);
  });

  it('postcss.config.js - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.parser).toEqual(require('sugarss'));
      expect(config.syntax).toEqual(require('sugarss'));
      expect(config.map).toEqual(false);
      expect(config.from).toEqual('./test/js/object/fixtures/index.css');
      expect(config.to).toEqual('./test/js/object/expect/index.css');

      expect(Object.keys(config.plugins).length).toEqual(3);

      expect(config.file).toEqual(
        path.resolve(testDirectory, 'js/object', 'postcss.config.js')
      );
    };

    const config = await loadConfig(
      true,
      ctx,
      path.resolve(testDirectory, 'js/object'),
      fs
    );

    expected(config);
  });

  it('postcss.config.js - {Array} - Load Config', async () => {
    const expected = (config) => {
      expect(config.parser).toEqual(require('sugarss'));
      expect(config.syntax).toEqual(require('sugarss'));
      expect(config.map).toEqual(false);
      expect(config.from).toEqual('./test/js/array/fixtures/index.css');
      expect(config.to).toEqual('./test/js/array/expect/index.css');

      expect(Object.keys(config.plugins).length).toEqual(3);

      expect(config.file).toEqual(
        path.resolve(testDirectory, 'js/array', 'postcss.config.js')
      );
    };

    const config = await loadConfig(
      true,
      ctx,
      path.resolve(testDirectory, 'js/array'),
      fs
    );

    expected(config);
  });

  it('package.json - {Object} - Load Config', async () => {
    const expected = (config) => {
      expect(config.parser).toEqual(false);
      expect(config.syntax).toEqual(false);
      expect(config.map).toEqual(false);
      expect(config.from).toEqual('./test/pkg/fixtures/index.css');
      expect(config.to).toEqual('./test/pkg/expect/index.css');
      expect(Object.keys(config.plugins).length).toEqual(3);

      expect(config.file).toEqual(
        path.resolve(testDirectory, 'pkg', 'package.json')
      );
    };

    const config = await loadConfig(
      true,
      {},
      path.resolve(testDirectory, 'pkg'),
      fs
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

  it('Plugin - {Type} - Invalid', async () => {
    try {
      await loadConfig(
        true,
        {},
        path.resolve(testDirectory, 'err/plugins'),
        fs
      );
    } catch (error) {
      expect(error.message).toMatch(
        /^Invalid PostCSS Plugin found at: (.*)\n\n\(@.*\)$/
      );
    }
  });

  it('Loading Plugin - {Object} - {Error}', async () => {
    try {
      await loadConfig(
        true,
        {},
        path.resolve(testDirectory, 'err/plugins/object'),
        fs
      );
    } catch (error) {
      expect(error.message).toMatch(/^Loading PostCSS Plugin failed: .*$/m);
    }
  });

  it('Loading Plugin - {Object} - Options - {Error}', async () => {
    try {
      await loadConfig(
        true,
        {},
        path.resolve(testDirectory, 'err/plugins/object/options'),
        fs
      );
    } catch (error) {
      expect(error.message).toMatch(/^Loading PostCSS Plugin failed: .*$/m);
    }
  });

  it('Loading Plugin - {Array} - {Error}', async () => {
    try {
      await loadConfig(
        true,
        {},
        path.resolve(testDirectory, 'err/plugins/array'),
        fs
      );
    } catch (error) {
      expect(error.message).toMatch(/^Cannot find (.*)$/);
    }
  });

  it('Loading Plugin - {Array} - Options - {Error}', async () => {
    try {
      await loadConfig(
        true,
        {},
        path.resolve(testDirectory, 'err/plugins/array/options'),
        fs
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
        true,
        {},
        path.resolve(testDirectory, 'err/options/parser'),
        fs
      );
    } catch (error) {
      expect(error.message).toMatch(/^Loading PostCSS Parser failed: .*$/m);
    }
  });

  it('Syntax - {String}', async () => {
    try {
      await loadConfig(
        true,
        {},
        path.resolve(testDirectory, 'err/options/syntax'),
        fs
      );
    } catch (error) {
      expect(error.message).toMatch(/^Loading PostCSS Syntax failed: .*$/m);
    }
  });

  it('Stringifier - {String}', async () => {
    try {
      await loadConfig(
        true,
        {},
        path.resolve(testDirectory, 'err/options/stringifier'),
        fs
      );
    } catch (error) {
      expect(error.message).toMatch(
        /^Loading PostCSS Stringifier failed: .*$/m
      );
    }
  });
});
