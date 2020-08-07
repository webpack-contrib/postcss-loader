import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('Config Options', () => {
  it('should work Config - {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {});
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Path - {String}', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: { path: 'test/fixtures/config/postcss.config.js' },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Context - {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: {
        path: 'test/fixtures/config/postcss.config.js',
        ctx: { plugin: true },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config - Context - {Object} - with ident', async () => {
    const compiler = getCompiler('./css/index.js', {
      ident: 'postcss',
      config: {
        path: 'test/fixtures/config/postcss.config.js',
        ctx: { plugin: true },
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Config – Context – Loader {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {
      config: {
        path: 'test/fixtures/config/context/postcss.config.js',
      },
    });
    const stats = await compile(compiler);

    const { assets } = stats.compilation;

    const asset = 'asset.txt';

    expect(asset in assets).toBeTruthy();
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    // Todo fixed error in testplugin
    // expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
