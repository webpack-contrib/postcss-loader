import Module from "node:module";

const postcss = require("postcss");

const parentModule = module;

function exec(code, loaderContext) {
  const { resource, context } = loaderContext;

  const module = new Module(resource, parentModule);

  module.paths = Module._nodeModulePaths(context);
  module.filename = resource;

  module._compile(code, resource);

  return module.exports;
}

module.exports = function astLoader(content) {
  const callback = this.async();
  const { spy = globalThis.jest.fn(), execute } = this.query;

  if (execute) {
    content = exec(content, this);
  }

  postcss()
    .process(content)
    .then((result) => {
      const ast = {
        type: "postcss",
        version: result.processor.version,
        root: result.root,
      };

      Object.defineProperty(ast, "root", {
        get: spy.mockReturnValue(result.root),
      });

      callback(null, result.css, result.map, { ast });
    });
};
