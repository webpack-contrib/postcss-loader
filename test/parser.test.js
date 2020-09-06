import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from './helpers';

describe('"parser" option', () => {
  it('should work with "String" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        parser: 'sugarss',
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "Object" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        parser: require('sugarss'),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "Function" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        parser: require('sugarss').parse,
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error on "unresolved" parser', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        parser: 'unresolved',
      },
    });

    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });
});
