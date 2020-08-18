import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('Postcss options', () => {
  it('should work "from", "to" and "map" postcssOptions', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        from: '/test/from.css',
        to: '/test/to.css',
        map: { inline: false, annotation: false },
      },
      config: false,
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);
    const notNormalizecodeFromBundle = getCodeFromBundle(
      'style.css',
      stats,
      false
    );

    const toIsWork = notNormalizecodeFromBundle.map.file.endsWith('to.css');
    const fromIsWork =
      notNormalizecodeFromBundle.map.sources.filter((i) =>
        i.endsWith('from.css')
      ).length > 0;

    expect(toIsWork).toBe(true);
    expect(fromIsWork).toBe(true);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
