import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('Options Sourcemap', () => {
  it('should work Sourcemap - {Boolean}', async () => {
    const compiler = getCompiler(
      './css/index.js',
      { sourceMap: true },
      { devtool: 'source-map' }
    );
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work disable Sourcemap - {Boolean}', async () => {
    const compiler = getCompiler(
      './css/index.js',
      { sourceMap: false },
      { devtool: 'source-map' }
    );
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toBeUndefined();
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Sourcemap - {String}', async () => {
    const compiler = getCompiler('./css/index.js', { sourceMap: 'inline' });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.map).toBeUndefined();
    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with prev sourceMap', async () => {
    const compiler = getCompiler(
      './scss/index.js',
      {
        config: false,
      },
      {
        devtool: 'source-map',
        module: {
          rules: [
            {
              test: /\.scss$/i,
              use: [
                {
                  loader: require.resolve('../helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../../src'),
                  options: {
                    config: false,
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    // eslint-disable-next-line global-require
                    implementation: require('sass'),
                  },
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.scss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
