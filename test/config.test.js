import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from './helpers';

const testDirectory = path.resolve(__dirname, './fixtures', 'config-autoload');

describe('"config" option', () => {
  it('should work without the specified value', async () => {
    const compiler = getCompiler('./config-scope/css/index.js');
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work without the specified value in the "postcssOptions" option', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {},
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "false" value', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: false,
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "true" value', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: true,
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "String" value (absolute path)', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/css/custom.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work "String" value (relative path)', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: 'test/fixtures/config-scope/css/custom.config.js',
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "String" value (with path to the directory with the configuration)', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: 'test/fixtures/config-scope',
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "package.json" configuration', async () => {
    const compiler = getCompiler('./config-autoload/pkg/index.js', {
      postcssOptions: {
        config: path.resolve(testDirectory, 'pkg'),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('index.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with the "postcssOptions" option', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: true,
        plugins: ['postcss-rtl'],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should work with "String" value and respect all options', async () => {
    const compiler = getCompiler('./sss/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/all-options/postcss.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.sss', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should throw an error on the unresolved config', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/css/unresolve.js'
        ),
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should throw an error on the invalid config', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/css/invalid.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats, true)).toMatchSnapshot('errors');
  });

  it('should work and resolve "from" and "to" options', async () => {
    const compiler = getCompiler('./config-scope/css/index.js', {
      postcssOptions: {
        config: path.resolve(
          __dirname,
          './fixtures/config-scope/from-to/postcss.config.js'
        ),
      },
    });
    const stats = await compile(compiler);

    const { css, sourceMap } = getCodeFromBundle('style.css', stats);

    sourceMap.sourceRoot = '';
    sourceMap.sources = sourceMap.sources.map((source) => {
      expect(path.isAbsolute(source)).toBe(false);
      expect(source).toBe(path.normalize(source));

      return source.replace(/\\/g, '/');
    });

    expect(css).toMatchSnapshot('css');
    expect(sourceMap).toMatchSnapshot('source map');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
