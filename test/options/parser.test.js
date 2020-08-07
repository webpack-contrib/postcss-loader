import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

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
                  loader: path.resolve(__dirname, '../../src'),
                  options: { parser: 'sugarss' },
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
                  loader: path.resolve(__dirname, '../../src'),
                  // eslint-disable-next-line global-require
                  options: { ident: 'postcss', parser: require('sugarss') },
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
