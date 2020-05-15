const postcss = require('postcss')
const postcssPkg = require('postcss/package.json')
const semver = require('semver')

const incomingVersion = semver.inc(postcssPkg.version, 'minor')

module.exports = function astLoader (content) {
  const callback = this.async()

  const { spy = jest.fn() } = this.query

  content = this.exec(content, this.resource)

  postcss()
    .process(content, { parser: require('postcss-js') })
    .then(({ css, map, root, messages }) => {
      const ast = {
        type: 'postcss',
        version: incomingVersion
      }

      Object.defineProperty(ast, 'root', {
        get: spy.mockReturnValue(root)
      })

      callback(null, css, map, { ast, messages })
    })
}
