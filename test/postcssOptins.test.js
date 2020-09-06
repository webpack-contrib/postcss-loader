import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from './helpers';

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

    const toIsWork = notNormalizecodeFromBundle.sourceMap.file.endsWith(
      'to.css'
    );
    const fromIsWork =
      notNormalizecodeFromBundle.sourceMap.sources.filter((i) =>
        i.endsWith('from.css')
      ).length > 0;

    expect(toIsWork).toBe(true);
    expect(fromIsWork).toBe(true);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(codeFromBundle.map).toMatchSnapshot('map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "map" option and generate inlined source maps', async () => {
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

  it('should work "Function" value', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('./fixtures/config-scope/config/plugin')()],
        };
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work "Function" value and with "Array" syntax of the "plugins" option', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('./fixtures/config-scope/config/plugin')()],
        };
      },
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work "Function" value and with "Object" syntax of the "plugins" option', async () => {
    const compiler = getCompiler('./css/index.js', {
      postcssOptions: () => {
        return {
          // eslint-disable-next-line global-require
          plugins: [require('./fixtures/config-scope/config/plugin')()],
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
