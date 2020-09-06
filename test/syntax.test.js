import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from './helpers';

describe('"syntax" option', () => {
  it('should work with "String" value', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        syntax: 'sugarss',
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
        // eslint-disable-next-line global-require
        syntax: require('sugarss'),
      },
    });

    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error on "unresolved" syntax', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        syntax: 'unresolved',
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });
});
