/**
 * @jest-environment node
 */

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

  it('should work with prev sourceMap (sass-loader)', async () => {
    const compiler = getCompiler(
      './scss/index.js',
      {},
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
                  options: {},
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

  it('should work with prev sourceMap (less-loader)', async () => {
    const compiler = getCompiler(
      './less/index.js',
      {
        config: false,
      },
      {
        devtool: 'source-map',
        module: {
          rules: [
            {
              test: /\.less$/i,
              use: [
                {
                  loader: require.resolve('../helpers/testLoader'),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, '../../src'),
                },
                {
                  loader: 'less-loader',
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.less', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should generated absolute paths in sourcemap', async () => {
    const compiler = getCompiler('./css/index.js', {
      sourceMap: true,
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);
    const notNormalizecodeFromBundle = getCodeFromBundle(
      'style.css',
      stats,
      false
    );

    const { sources } = notNormalizecodeFromBundle.map;
    const expectedFile = path.resolve(
      __dirname,
      '..',
      'fixtures',
      'css',
      'style.css'
    );

    const normalizePath = (src) =>
      path.sep === '\\' ? src.replace(/\\/g, '/') : src;

    sources.forEach((source) =>
      expect(source).toEqual(normalizePath(expectedFile))
    );

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
