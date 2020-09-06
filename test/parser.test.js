import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from './helpers';

describe('Options Parser', () => {
  it('should work Parser - {String}', async () => {
    const compiler = getCompiler(
      './sss/index.js',
      {},
      {
        module: {
          rules: [
            {
              test: /\.sss$/i,
              use: [
                {
                  loader: require.resolve('./helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../src'),
                  options: {
                    postcssOptions: {
                      parser: 'sugarss',
                    },
                  },
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Parser - {Object}', async () => {
    const compiler = getCompiler(
      './sss/index.js',
      {},
      {
        module: {
          rules: [
            {
              test: /\.sss$/i,
              use: [
                {
                  loader: require.resolve('./helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../src'),
                  // eslint-disable-next-line global-require
                  options: {
                    postcssOptions: {
                      // eslint-disable-next-line global-require,import/no-dynamic-require
                      parser: require('sugarss'),
                    },
                  },
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Parser - {Function}', async () => {
    const compiler = getCompiler(
      './sss/index.js',
      {},
      {
        module: {
          rules: [
            {
              test: /\.sss$/i,
              use: [
                {
                  loader: require.resolve('./helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../src'),
                  // eslint-disable-next-line global-require
                  options: {
                    postcssOptions: {
                      // eslint-disable-next-line global-require,import/no-dynamic-require
                      parser: require('sugarss').parse,
                    },
                  },
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error on "unresolved" parser', async () => {
    const compiler = getCompiler(
      './sss/index.js',
      {},
      {
        module: {
          rules: [
            {
              test: /\.sss$/i,
              use: [
                {
                  loader: require.resolve('./helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../src'),
                  options: {
                    postcssOptions: {
                      parser: 'unresolved',
                    },
                  },
                },
              ],
            },
          ],
        },
      }
    );

    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });
});
