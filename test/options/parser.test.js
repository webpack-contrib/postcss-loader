const { webpack } = require('@webpack-utilities/test')

describe('Options', () => {
  test('Parser - {String}', () => {
    const config = {
      loader: {
        test: /\.sss$/,
        options: {
          parser: 'sugarss'
        }
      }
    }

    return webpack('sss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual('module.exports = "a {\\n  color: black\\n}\\n"')
      expect(source).toMatchSnapshot()
    })
  })

  test('Parser - {Object}', () => {
    const config = {
      loader: {
        test: /\.sss$/,
        options: {
          ident: 'postcss',
          parser: require('sugarss')
        }
      }
    }

    return webpack('sss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual('module.exports = "a {\\n  color: black\\n}\\n"')
      expect(source).toMatchSnapshot()
    })
  })
})
