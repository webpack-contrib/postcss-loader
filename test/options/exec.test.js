import path from 'path';

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from '../helpers/index';

describe('Options Exec', () => {
  // Todo loaderContext.exec is deprecated and removed in webpack 5
  // it('should work Exec - {Boolean}', async () => {
  //   const compiler = getCompiler(
  //     './jss/exec/index.js',
  //     {},
  //     {
  //       module: {
  //         rules: [
  //           {
  //             test: /style\.(exec\.js|js)$/i,
  //             use: [
  //               {
  //                 loader: path.resolve(__dirname, '../../src'),
  //                 options: { exec: true },
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     }
  //   );
  //   const stats = await compile(compiler);
  //
  //   const codeFromBundle = getCodeFromBundle('style.exec.js', stats);
  //
  //   expect(codeFromBundle.css).toMatchSnapshot('css');
  //   expect(getWarnings(stats)).toMatchSnapshot('warnings');
  //   expect(getErrors(stats)).toMatchSnapshot('errors');
  // });

  it('should work JSS - {String}', async () => {
    const compiler = getCompiler(
      './jss/index.js',
      {},
      {
        module: {
          rules: [
            {
              test: /style.\.js$/i,
              use: [
                {
                  loader: path.resolve(__dirname, '../../src'),
                  options: { parser: 'postcss-js' },
                },
              ],
            },
          ],
        },
      }
    );

    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle('style.js', stats);

    expect(codeFromBundle.css).toMatchSnapshot('css');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
    expect(getErrors(stats)).toMatchSnapshot('errors');
  });
});
