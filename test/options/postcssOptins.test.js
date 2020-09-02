import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('"postcssOptions" option', () => {
  it('should work with "from", "to" and "map" options', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        from: '/test/from.css',
        to: '/test/to.css',
        map: { inline: false, annotation: false },
      },
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

  it('should work the the "map" option and generate inlined source maps', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: {
        map: { inline: true, annotation: false },
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work when the "postcssOptions" option is "Function"', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('../fixtures/config-scope/config/plugin')()],
        };
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work when the "postcssOptions" option is "Function" and the "plugins" option is "Array"', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('../fixtures/config-scope/config/plugin')()],
        };
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work when the "postcssOptions" option is "Function" and the "plugins" option is "Object"', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('../fixtures/config-scope/config/plugin')()],
        };
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
