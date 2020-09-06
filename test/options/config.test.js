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
  it('should work without the specified value', async () => {
    const compiler = getCompiler('./config-scope/css/index.js');
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "false" value', async () => {
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

  it('should work with "true" value', async () => {
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

  it('should work with "string" value (absolute path)', async () => {
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

  it('should work "string" value (relative path)', async () => {
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

  it('should work with "string" value (path to directory with the configuration)', async () => {
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

  it('should work with "Object" value', async () => {
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

  it('should work with "postcss.config.js" and the array syntax of the "plugin" option', async () => {
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

  it('should work with "postcss.config.js" and the object syntax of the "plugin" option', async () => {
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

  it('should work with "package.json"', async () => {
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

  it('should throw an error on the unresolved config', async () => {
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

  it('should throw an error on the invalid config', async () => {
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

  it('should work with "string" value and respect all options', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          '../fixtures/config-scope/all-options/postcss.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
