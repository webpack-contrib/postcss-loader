import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

const testDirectory = path.resolve(__dirname, '../fixtures', 'config-autoload');

describe('"config" option', () => {
  it('should work Config - false', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: false,
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - true', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: true,
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - "string"', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          '../fixtures/config-scope/css/custom.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - "string" with relative path', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: 'test/fixtures/config-scope/css/custom.config.js',
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - "string" with path directory', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: 'test/fixtures/config-scope',
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Object - path file', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: {
          path: path.resolve(
            __dirname,
            '../fixtures/config-scope/css/custom.config.js'
          ),
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - {Object}', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {});
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Path - {String}', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: { path: 'test/fixtures/config-scope/config/postcss.config.js' },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Context - {Object}', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: {
          path: 'test/fixtures/config-scope/config/postcss.config.js',
          ctx: { plugin: true },
        },
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
      postcssOptions: {
        config: {
          path: 'test/fixtures/config-scope/config/context/postcss.config.js',
        },
      },
    });
    const stats = await compile(compiler);

    const { assets } = stats.compilation;

    const asset = 'asset.txt';

    expect(asset in assets).toBeTruthy();
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work postcss.config.js - {Object} - Process CSS', async () => {
    const compiler = getCompiler('./config-autoload/js/object/index.js', {
      postcssOptions: {
        config: {
          path: path.resolve(testDirectory, 'js/object'),
          ctx: { parser: false, syntax: false },
        },
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
      postcssOptions: {
        config: {
          path: path.resolve(testDirectory, 'js/array'),
          ctx: { parser: false, syntax: false },
        },
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
      postcssOptions: {
        config: {
          path: path.resolve(testDirectory, 'pkg'),
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('index.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error when unresolved config ', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          '../fixtures/config-scope/css/unresolve.js'
        ),
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should throw an error on the invalid config ', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          '../fixtures/config-scope/css/invalid.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work if the "config" options is not specified', async () => {
    const compiler = getCompiler('./css/index.js', {});
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "postcssOptions" option', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: true,
        plugins: ['postcss-rtl'],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
