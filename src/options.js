/**
 * **PostCSS Options Parser**
 *
 * Transforms the loader options into a valid postcss config `{Object}`
 *
 * @method parseOptions
 *
 * @param {Boolean} exec Execute CSS-in-JS
 * @param {String|Object} parser PostCSS Parser
 * @param {String|Object} syntax PostCSS Syntax
 * @param {String|Object} stringifier PostCSS Stringifier
 * @param {Array|Object|Function} plugins PostCSS Plugins
 *
 * @return {Promise} PostCSS Config
 */
function parseOptions({ exec, parser, syntax, stringifier, plugins }) {
  const options = {};

  options.parser = parser;
  options.syntax = syntax;
  options.stringifier = stringifier;

  return { options, plugins, exec };
}

module.exports = parseOptions;
