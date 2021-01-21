import postcss from "postcss";

import {
  compile,
  getCompiler,
  getErrors,
  getCodeFromBundle,
  getWarnings,
} from "./helpers";

describe('"implementation" option', () => {
  it("should work with a custom instance of PostCSS", async () => {
    const spy = jest.fn(postcss);
    const compiler = getCompiler("./css/index.js", {
      // Wrap the spy so it is an instanceof Function
      implementation: (...args) => spy(...args),
    });
    const stats = await compile(compiler);
    const codeFromBundle = getCodeFromBundle("style.css", stats);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(codeFromBundle.css).toMatchSnapshot("css");
    expect(getWarnings(stats)).toMatchSnapshot("warnings");
    expect(getErrors(stats)).toMatchSnapshot("errors");
  });
});
