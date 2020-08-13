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
                  options: { syntax: 'sugarss', config: false },
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
                    ident: 'postcss',
                    // eslint-disable-next-line global-require
                    syntax: require('sugarss'),
                    config: false,
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
});
