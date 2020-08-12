import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

const testDirectory = path.resolve(__dirname, '../fixtures', 'config-autoload');

describe('Config Options', () => {
  it('should work Config - false', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: false,
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - true', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: true,
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - "string"', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: path.resolve(__dirname, '../fixtures/css/custom.config.js'),
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - "string" with relative path', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: 'test/fixtures/css/custom.config.js',
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - "string" with path directory', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: 'test/fixtures',
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Object - path file', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: {
        path: path.resolve(__dirname, '../fixtures/css/custom.config.js'),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {});
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Path - {String}', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: { path: 'test/fixtures/config/postcss.config.js' },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Context - {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: {
        path: 'test/fixtures/config/postcss.config.js',
        ctx: { plugin: true },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Context - {Object} - with ident', async () => {
    const compiler = getCompiler('./css/index.js', {
      ident: 'postcss',
      config: {
        path: 'test/fixtures/config/postcss.config.js',
        ctx: { plugin: true },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config – Context – Loader {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: {
        path: 'test/fixtures/config/context/postcss.config.js',
      },
    });
    const stats = await compile(compiler);

    const { assets } = stats.compilation;

    const asset = 'asset.txt';

    expect(asset in assets).toBeTruthy();
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    // Todo fixed error in testplugin
    // expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work postcss.config.js - {Object} - Process CSS', async () => {
    const compiler = getCompiler('./config-autoload/js/object/index.js', {
      config: {
        path: path.resolve(testDirectory, 'js/object'),
        ctx: { parser: false, syntax: false },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('index.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work postcss.config.js - {Array} - Process CSS', async () => {
    const compiler = getCompiler('./config-autoload/js/array/index.js', {
      config: {
        path: path.resolve(testDirectory, 'js/array'),
        ctx: { parser: false, syntax: false },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('index.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work package.json - {Object} - Process CSS', async () => {
    const compiler = getCompiler('./config-autoload/pkg/index.js', {
      config: {
        path: path.resolve(testDirectory, 'pkg'),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('index.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
