import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from './helpers';

describe('"exec" option', () => {
  it('should work with "Boolean" value', async () => {
    const compiler = getCompiler(
      './jss/exec/index.js',
      {},
      {
        module: {
          rules: [
            {
              test: /style\.(exec\.js|js)$/i,
              use: [
                {
                  loader: require.resolve('./helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../src'),
                  options: {
                    exec: true,
                  },
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.exec.js', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "JSS" parser', async () => {
    const compiler = getCompiler(
      './jss/index.js',
      {},
      {
        module: {
          rules: [
            {
              test: /style\.js$/i,
              use: [
                {
                  loader: require.resolve('./helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../src'),
                  options: {
                    postcssOptions: {
                      parser: 'postcss-js',
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

    const codeFromBundle = getCodeFromBundle('style.js', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
