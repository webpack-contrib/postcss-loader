import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('Options Syntax', () => {
  it('should work Syntax - {String}', async () => {
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
                  loader: require.resolve('../helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../../src'),
                  options: { syntax: 'sugarss' },
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

  it('should work Syntax - {Object}', async () => {
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
                  loader: require.resolve('../helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../../src'),
                  options: {
                    // eslint-disable-next-line global-require
                    syntax: require('sugarss'),
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

  it('should emit error Syntax', async () => {
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
                  loader: require.resolve('../helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../../src'),
                  options: { syntax: 'unresolve' },
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
