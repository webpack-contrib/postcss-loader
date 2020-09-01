import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('Options Plugins', () => {
  it('should work Plugins - {Array}', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require
        plugins: [require('../fixtures/config-scope/config/plugin')()],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Plugins - {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require
        plugins: require('../fixtures/config-scope/config/plugin'),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Plugins - {Function} - {Array}', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require
        plugins: () => [require('../fixtures/config-scope/config/plugin')()],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Plugins - {Function} - {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require
        plugins: () => require('../fixtures/config-scope/config/plugin')(),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Plugins - {Object without require}', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        plugins: {
          'postcss-import': {},
          'postcss-nested': {},
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Plugins - {empty Object}', async () => {
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

  it('should work Plugins - {Object without require} + options', async () => {
    const compiler = getCompiler('./css/index2.js', {
      postcssOptions: {
        plugins: {
          'postcss-short': { prefix: 'x' },
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style2.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Plugins - {Object} + options', async () => {
    const compiler = getCompiler('./css/index2.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require
        plugins: require('postcss-short')({ prefix: 'x' }),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style2.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Plugins - { Array } Array + options', async () => {
    const compiler = getCompiler('./css/index2.js', {
      plugins: [
        'postcss-import',
        ['postcss-nested'],
        ['postcss-short', { prefix: 'x' }],
      ],
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style2.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Plugins - {Array<Object>} + options', async () => {
    const compiler = getCompiler('./css/index2.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require
        plugins: [require('postcss-short')({ prefix: 'x' })],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style2.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should disables plugin from config', async () => {
    const compiler = getCompiler('./css/index2.js', {
      config: 'test/fixtures/css/plugins.config.js',
      postcssOptions: {
        plugins: {
          'postcss-short': false,
        },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style2.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should emit error on load plugin', async () => {
    const compiler = getCompiler('./css/index2.js', {
      postcssOptions: {
        plugins: {
          'postcss-unresolved': {},
        },
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });
});
