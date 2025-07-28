import Module from "node:module";
import path from "node:path";

const parentModule = module;

export default (code) => {
  const resource = "test.js";
  const module = new Module(resource, parentModule);

  module.paths = Module._nodeModulePaths(
    path.resolve(__dirname, "../fixtures"),
  );
  module.filename = resource;

  module._compile(
    `let __export__;${code};module.exports = __export__;`,
    resource,
  );

  return module.exports;
};
