import Module from "module";

const postcss = require("postcss");

const parentModule = module;

function exec(code, loaderContext) {
  const { resource, context } = loaderContext;

  const module = new Module(resource, parentModule);

  // eslint-disable-next-line no-underscore-dangle
  module.paths = Module._nodeModulePaths(context);
  module.filename = resource;

  // eslint-disable-next-line no-underscore-dangle
  module._compile(code, resource);

  return module.exports;
}

module.exports = function astLoader(content) {
  const callback = this.async();
  const { spy = jest.fn(), execute } = this.query;

  if (execute) {
    // eslint-disable-next-line no-param-reassign
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
