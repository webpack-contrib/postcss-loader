import path from "path";

import postcss from "postcss";
import { NormalModule } from "webpack";

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from "./helpers/index";

describe("loader", () => {
  it("should work", async () => {
    const compiler = getCompiler("./css/index.js");
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle("style.css", stats);

    expect(codeFromBundle.css).toMatchSnapshot("css");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should throw an error on invalid syntax", async () => {
    const compiler = getCompiler("./css/index.js", {
      postcssOptions: {
        hideNothingWarning: true,
        parser: "sugarss",
      },
    });
    const stats = await compile(compiler);

    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should emit warning using the "messages" API', async () => {
    const plugin = () => (css, result) => {
      css.walkDecls((node) => {
        node.warn(result, "<Message>");
      });
    };

    const postcssPlugin = postcss.plugin("postcss-plugin", plugin);

    const compiler = getCompiler("./css/index.js", {
      postcssOptions: {
        plugins: [postcssPlugin()],
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle("style.css", stats);

    expect(codeFromBundle.css).toMatchSnapshot("css");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should emit asset using the "messages" API', async () => {
    const plugin = () => (css, result) => {
      result.messages.push({
        type: "asset",
        file: "sprite.svg",
        content: "<svg>...</svg>",
        plugin,
      });
    };

    const postcssPlugin = postcss.plugin("postcss-assets", plugin);
    const compiler = getCompiler("./css/index.js", {
      postcssOptions: {
        plugins: [postcssPlugin()],
      },
    });
    const stats = await compile(compiler);

    // eslint-disable-next-line no-underscore-dangle
    expect(stats.compilation.assets["sprite.svg"]).toBeDefined();
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it('should register dependencies using the "messages" API', async () => {
    const plugin = () => (css, result) => {
      result.messages.push({
        type: "build-dependency",
        file: "build-dep.html",
        content: "",
        plugin,
      });
    };

    let actualBuildInfo = null;

    const postcssPlugin = postcss.plugin("postcss-plugin", plugin);
    const compiler = getCompiler(
      "./css/index.js",
      {
        postcssOptions: {
          plugins: [postcssPlugin()],
        },
      },
      {
        plugins: [
          {
            /** @param {import("webpack").Compiler} compiler */
            apply(wpcompiler) {
              wpcompiler.hooks.compilation.tap("plugin", (compilation) => {
                NormalModule.getCompilationHooks(compilation).beforeLoaders.tap(
                  "plugin",
                  (_1, module) => {
                    actualBuildInfo = module.buildInfo;
                  }
                );
              });
            },
          },
        ],
      }
    );

    const stats = await compile(compiler);

    const buildDependencies = [...actualBuildInfo.buildDependencies];
    expect(buildDependencies).toContain("build-dep.html");

    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should reuse PostCSS AST", async () => {
    const spy = jest.fn();
    const compiler = getCompiler(
      "./css/index.js",
      {},
      {
        module: {
          rules: [
            {
              test: /\.(css|sss)$/i,
              use: [
                {
                  loader: require.resolve("./helpers/testLoader"),
                  options: {},
                },
                {
                  loader: path.resolve(__dirname, "../src"),
                  options: {
                    postcssOptions: { hideNothingWarning: true },
                  },
                },
                {
                  loader: require.resolve("./helpers/astLoader"),
                  options: { spy },
                },
              ],
            },
          ],
        },
      }
    );
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle("style.css", stats);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(codeFromBundle.css).toMatchSnapshot("css");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });

  it("should work with SugarSS", async () => {
    const compiler = getCompiler("./sss/index.js", {
      postcssOptions: {
        parser: "sugarss",
        hideNothingWarning: true,
      },
    });
    const stats = await compile(compiler);

    const codeFromBundle = getCodeFromBundle("style.sss", stats);

    expect(codeFromBundle.css).toMatchSnapshot("css");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
