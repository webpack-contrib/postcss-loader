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

  it('should work Sourcemap - {String}', async () => {
    const compiler = getCompiler('./css/index.js', { sourceMap: 'inline' });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.map).toBeUndefined();
    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
