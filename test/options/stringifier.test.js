const { webpack } = require('@webpack-utilities/test')

describe('Options', () => {
  test('Stringifier - {String}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          stringifier: 'sugarss'
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual('module.exports = "a  color: black\\n"')
      expect(source).toMatchSnapshot()
    })
  })

  test('Stringifier - {Object}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          ident: 'postcss',
          stringifier: require('sugarss')
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual('module.exports = "a  color: black\\n"')
      expect(source).toMatchSnapshot()
    })
  })
})
