import postcss from 'postcss';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from './helpers/index';

describe('loader', () => {
  it('should work', async () => {
    const compiler = getCompiler('./css/index.js', {
      plugins: [],
      config: false,
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should emit warning', async () => {
    const plugin = () => (css, result) => {
      css.walkDecls((node) => {
        node.warn(result, '<Message>');
      });
    };

    const postcssPlugin = postcss.plugin('postcss-plugin', plugin);

    const compiler = getCompiler('./css/index.js', {
      plugins: [postcssPlugin()],
      config: false,
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.css', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });

  it('should emit Syntax Error', async () => {
    const compiler = getCompiler('./css/index.js', {
      parser: 'sugarss',
      config: false,
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
