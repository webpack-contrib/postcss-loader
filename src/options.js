function parseOptions ({ exec, parser, syntax, stringifier, plugins }) {
  if (typeof plugins === 'function') {
    plugins = plugins.call(this, this)
  }

  if (typeof plugins === 'undefined') {
    plugins = []
  } else if (!Array.isArray(plugins)) {
    plugins = [ plugins ]
  }

  const options = {}

  options.parser = parser
  options.syntax = syntax
  options.stringifier = stringifier

  return Promise.resolve({ options, plugins, exec })
}

module.exports = parseOptions
