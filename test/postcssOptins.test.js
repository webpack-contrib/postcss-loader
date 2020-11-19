import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from './helpers';
import myPostcssPlugin from './fixtures/plugin/plugin';

jest.setTimeout(30000);

describe('"postcssOptions" option', () => {
  it('should work without the specified values in the "postcssOptions" option', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {},
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "from", "to" and "map" options (absolute paths)', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        from: '/test/from.css',
        to: '/test/to.css',
        map: { inline: false, annotation: false },
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);
    const toIsWork = codeFromBundle.sourceMap.file.endsWith('to.css');
    const fromIsWork =
      codeFromBundle.sourceMap.sources.filter((i) => i.endsWith('from.css'))
        .length > 0;

    expect(toIsWork).toBe(true);
    expect(fromIsWork).toBe(true);
    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "from", "to" and "map" options (relative paths)', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        from: './css/style.css',
        to: './css/style.css',
        map: { inline: false, annotation: false },
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);
    const toIsWork = codeFromBundle.sourceMap.file.endsWith('style.css');
    const fromIsWork =
      codeFromBundle.sourceMap.sources.filter((i) => i.endsWith('style.css'))
        .length > 0;

    expect(toIsWork).toBe(true);
    expect(fromIsWork).toBe(true);
    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "map" option and generate inlined source maps', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        map: { inline: true, annotation: false },
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work "Function" value', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('./fixtures/config-scope/config/plugin')()],
        };
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work "Function" value and with "Array" syntax of the "plugins" option', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('./fixtures/config-scope/config/plugin')()],
        };
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work "Function" value and with "Object" syntax of the "plugins" option', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('./fixtures/config-scope/config/plugin')()],
        };
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "parser" option with "String" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        parser: 'sugarss',
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "parser" option with "Object" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        parser: require('sugarss'),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "parser" option with "Function" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        parser: require('sugarss').parse,
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error with the "parser" option on the unresolved parser', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        parser: 'unresolved',
      },
    });

    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work with the "stringifier" option with "String" value', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        stringifier: 'sugarss',
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "stringifier" option with "Object" value', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require
        stringifier: require('sugarss'),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "stringifier" option with "Function" value', async () => {
    // eslint-disable-next-line global-require
    const Midas = require('midas');
    const midas = new Midas();

    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        stringifier: midas.stringifier,
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error with the "stringifier" option on the unresolved stringifier', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        stringifier: 'unresolved',
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work with the "syntax" option with "String" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        syntax: 'sugarss',
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "syntax" option with "Object" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require
        syntax: require('sugarss'),
      },
    });

    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error with "syntax" option on the unresolved syntax', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        syntax: 'unresolved',
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Array" value', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: [
          'postcss-nested',
          ['postcss-short', { prefix: 'x' }],
          myPostcssPlugin,
          // Like:
          // `
          // import myPlugin from './path/to/plugin.mjs';
          //
          // const initPlugin = myPlugin();
          // `
          (root) => {
            root.walkDecls((decl) => {
              if (decl.value === 'red') {
                // eslint-disable-next-line no-param-reassign
                decl.value = 'rgba(255, 0, 0, 1.0)';
              }
            });
          },
          // Like:
          // `
          // import myPlugin from './path/to/plugin.mjs';
          // `
          {
            postcss: (root) => {
              root.walkDecls((decl) => {
                if (decl.value === 'green') {
                  // eslint-disable-next-line no-param-reassign
                  decl.value = 'rgba(0, 255, 0, 1.0)';
                }
              });
            },
          },
          require.resolve('./fixtures/plugin/other-plugin'),
          myPostcssPlugin({ color: 'white', alpha: 0 }),
          { 'postcss-short': { prefix: 'z' } },
          // New API
          require.resolve('./fixtures/plugin/new-api.plugin'),
        ],
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Object" value', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: {
          'postcss-import': {},
          'postcss-nested': {},
          'postcss-short': { prefix: 'x' },
          [require.resolve('./fixtures/plugin/other-plugin')]: {},
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with empty "Array" value', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: [],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with empty "Object" value', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: {},
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Array" value and support disabling plugins from the configuration', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        config: path.resolve(__dirname, './fixtures/css/plugins.config.js'),
        plugins: [{ 'postcss-short': false }],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Object" value and support disabling plugins from the configuration', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        config: path.resolve(__dirname, './fixtures/css/plugins.config.js'),
        plugins: {
          'postcss-short': false,
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Object" value and only disabled plugins', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: {
          'postcss-import': false,
          'postcss-nested': false,
          'postcss-short': false,
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Array" value and override the previous plugin options', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: [
          ['postcss-short', { prefix: 'x' }],
          ['postcss-short', { prefix: 'z' }],
        ],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Object" value and override the previous plugin options', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: {
          'postcss-short': { prefix: 'x' },
          // eslint-disable-next-line no-dupe-keys
          'postcss-short': { prefix: 'z' },
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Array" value, and config, and override the previous plugin options', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        config: path.resolve(__dirname, './fixtures/css/plugins.config.js'),
        plugins: [['postcss-short', { prefix: 'z' }]],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Object" value, and config, and override the previous plugin options', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        config: path.resolve(__dirname, './fixtures/css/plugins.config.js'),
        plugins: {
          'postcss-short': { prefix: 'z' },
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error with the "plugins" option on the unresolved plugin', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: ['postcss-unresolved'],
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with "Array" value and not throw an error on falsy plugin', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        // eslint-disable-next-line no-undefined
        plugins: [undefined, null, '', 0],
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with the "default" property without options', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: [
          path.resolve(__dirname, './fixtures/plugin/default-other-plugin.js'),
        ],
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "plugins" option with the "default" property with options', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: [
          [
            path.resolve(
              __dirname,
              './fixtures/plugin/default-other-plugin.js'
            ),
            { alpha: 0.5, color: 'red' },
          ],
        ],
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "config" options with "false" value', async () => {
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

  it('should work with the "config" options with "true" value', async () => {
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

  it('should work with the "config" options with "String" value (absolute path)', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/css/custom.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "config" options "String" value (relative path)', async () => {
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

  it('should work with the "config" options with "String" value (with path to the directory with the configuration)', async () => {
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

  it('should work with the "config" options with "package.json" configuration', async () => {
    const compiler = getCompiler('./config-autoload/pkg/index.js', {
      postcssOptions: {
        config: path.resolve(__dirname, './fixtures', 'config-autoload/pkg'),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('index.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "config" options and use plugins', async () => {
    const compiler = getCompiler('./config-scope/with-config/index.js', {
      postcssOptions: {
        config: true,
        plugins: ['postcss-dark-theme-class'],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "config" options with "String" value and respect all options', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/all-options/postcss.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error with the "config" option on the unresolved config', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/css/unresolve.js'
        ),
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should throw an error with the "config" option on the invalid config', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/css/invalid.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work with the "config" options and resolve "from" and "to" options', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/from-to/postcss.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(false);
      expect(source).toBe(path.normalize(source));

      return source.replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work and provide API for the configuration', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/api/postcss.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
