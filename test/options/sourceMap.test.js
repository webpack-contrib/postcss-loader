/**
 * @jest-environment node
 */

import path from 'path';
import fs from 'fs';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('"sourceMap" option', () => {
  it('should generate source maps when value has "true" value and the "devtool" option has "false" value', async () => {
    const compiler = getCompiler(
      './css/index.js',
      {
        sourceMap: true,
      },
      {
        devtool: false,
      }
    );
    const stats = await compile(compiler);
    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(true);
      expect(source).toBe(path.normalize(source));
      expect(fs.existsSync(path.resolve(sourceMap.sourceRoot, source))).toBe(
        true
      );

      return path
        .relative(path.resolve(__dirname, '..'), source)
        .replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should generate source maps when value has "true" value and the "devtool" option has "source-map" value', async () => {
    const compiler = getCompiler(
      './css/index.js',
      {
        sourceMap: true,
      },
      {
        devtool: 'source-map',
      }
    );
    const stats = await compile(compiler);
    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(true);
      expect(source).toBe(path.normalize(source));
      expect(fs.existsSync(path.resolve(sourceMap.sourceRoot, source))).toBe(
        true
      );

      return path
        .relative(path.resolve(__dirname, '..'), source)
        .replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should generate source maps when value is not specified and the "devtool" option has "source-map" value', async () => {
    const compiler = getCompiler(
      './css/index.js',
      {},
      {
        devtool: 'source-map',
      }
    );
    const stats = await compile(compiler);
    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(true);
      expect(source).toBe(path.normalize(source));
      expect(fs.existsSync(path.resolve(sourceMap.sourceRoot, source))).toBe(
        true
      );

      return path
        .relative(path.resolve(__dirname, '..'), source)
        .replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should generate source maps when value has "false" value, but the "postcssOptions.map" has values', async () => {
    const compiler = getCompiler(
      './css/index.js',
      {
        postcssOptions: {
          map: {
            inline: false,
            annotation: false,
            prev: false,
            sourcesContent: true,
          },
        },
      },
      {
        devtool: false,
      }
    );
    const stats = await compile(compiler);
    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(false);
      expect(source).toBe(path.normalize(source));
      expect(
        fs.existsSync(path.resolve(__dirname, '../fixtures/css', source))
      ).toBe(true);

      return path
        .relative(path.resolve(__dirname, '..'), source)
        .replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should generate source maps the "postcssOptions.map" has the "true" values and previous loader returns source maps ("sass-loader")', async () => {
    const compiler = getCompiler(
      './scss/index.js',
      {},
      {
        devtool: false,
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
                    postcssOptions: {
                      map: true,
                    },
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
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
    const { css, sourceMap } = getCodeFromBundle('style.scss', stats);

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toBeUndefined();
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should generate source maps the "postcssOptions.map" has values and previous loader returns source maps ("sass-loader")', async () => {
    const compiler = getCompiler(
      './scss/index.js',
      {},
      {
        devtool: false,
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
                    postcssOptions: {
                      map: {
                        inline: false,
                        sourcesContent: true,
                        annotation: true,
                        from: path.resolve(
                          __dirname,
                          '../fixtures/scss/style.scss'
                        ),
                      },
                    },
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
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
    const { css, sourceMap } = getCodeFromBundle('style.scss', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(true);
      expect(source).toBe(path.normalize(source));
      expect(
        fs.existsSync(path.resolve(__dirname, '../fixtures/css', source))
      ).toBe(true);

      return path
        .relative(path.resolve(__dirname, '..'), source)
        .replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should generate source maps when previous loader returns source maps ("sass-loader")', async () => {
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
    const { css, sourceMap } = getCodeFromBundle('style.scss', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(true);
      expect(source).toBe(path.normalize(source));
      expect(fs.existsSync(path.resolve(sourceMap.sourceRoot, source))).toBe(
        true
      );

      return path
        .relative(path.resolve(__dirname, '..'), source)
        .replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should generate source maps when previous loader returns source maps ("less-loader")', async () => {
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
    const { css, sourceMap } = getCodeFromBundle('style.less', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(true);
      expect(source).toBe(path.normalize(source));
      expect(fs.existsSync(path.resolve(sourceMap.sourceRoot, source))).toBe(
        true
      );

      return path
        .relative(path.resolve(__dirname, '..'), source)
        .replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should not generate source maps when value has "false" value and the "devtool" option has "false" value', async () => {
    const compiler = getCompiler(
      './css/index.js',
      {
        sourceMap: false,
      },
      {
        devtool: false,
      }
    );
    const stats = await compile(compiler);
    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toBeUndefined();
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should not generate source maps when value has "false" value and the "devtool" option has "source-map" value', async () => {
    const compiler = getCompiler(
      './css/index.js',
      {
        sourceMap: false,
      },
      {
        devtool: 'source-map',
      }
    );
    const stats = await compile(compiler);
    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toBeUndefined();
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should not generate source maps when value is not specified and the "devtool" option has "source-map" value', async () => {
    const compiler = getCompiler(
      './css/index.js',
      {},
      {
        devtool: false,
      }
    );
    const stats = await compile(compiler);
    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toBeUndefined();
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
