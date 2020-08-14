import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('Options Stringifier', () => {
  it('should work Stringifier - {String}', async () => {
    const compiler = getCompiler('./css/index.js', {
      stringifier: 'sugarss',
      config: false,
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work Stringifier - {Object}', async () => {
    const compiler = getCompiler('./css/index.js', {
      ident: 'postcss',
      // eslint-disable-next-line global-require
      stringifier: require('sugarss'),
      config: false,
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should emit error Stringifier', async () => {
    const compiler = getCompiler('./css/index.js', {
      ident: 'postcss',
      // eslint-disable-next-line global-require
      stringifier: 'unresolved',
      config: false,
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });
});
