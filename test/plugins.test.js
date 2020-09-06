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

describe('"plugins" option', () => {
  it('should work with "Array"', async () => {
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
        ],
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "Object"', async () => {
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

  it('should work with empty "Array"', async () => {
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

  it('should work with empty "Object"', async () => {
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

  it('should work with "Array" and support disabling plugins from the configuration', async () => {
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

  it('should work with "Object" and support disabling plugins from the configuration', async () => {
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

  it('should work with "Object" and only disabled plugins', async () => {
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

  it('should work with "Array" and override the previous plugin options', async () => {
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

  it('should work with "Array", and config, and override the previous plugin options', async () => {
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

  it('should work with "Object" and override the previous plugin options', async () => {
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

  it('should work with "Object", and config, and override the previous plugin options', async () => {
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

  it('should throw an error on the unresolved plugin', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: ['postcss-unresolved'],
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work with "Array" and not throw an error on falsy plugin', async () => {
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
});
