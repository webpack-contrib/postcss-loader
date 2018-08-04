const { webpack } = require('@webpack-utilities/test')

describe('Options', () => {
  test('Config - {Object}', () => {
    const config = {
      loader: {
        test: /\.css$/
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual(
        'module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"'
      )

      expect(source).toMatchSnapshot()
    })
  })

  test('Config - Path - {String}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          config: { path: 'test/fixtures/config/postcss.config.js' }
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual('module.exports = "a { color: black }\\n"')
      expect(source).toMatchSnapshot()
    })
  })

  test('Config - Context - {Object}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          config: {
            path: 'test/fixtures/config/postcss.config.js',
            ctx: { plugin: true }
          }
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual(
        'module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"'
      )

      expect(source).toMatchSnapshot()
    })
  })

  test('Config - Context - {Object} - with ident', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          ident: 'postcss',
          config: {
            path: 'test/fixtures/config/postcss.config.js',
            ctx: { plugin: true }
          }
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual(
        'module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"'
      )

      expect(source).toMatchSnapshot()
    })
  })

  test('Config – Context – Loader {Object}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          config: {
            path: 'test/fixtures/config/context/postcss.config.js'
          }
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { assets } = stats.compilation

      const asset = 'asset.txt'

      expect(asset in assets).toBeTruthy()
      expect(assets[asset].source()).toBe('123')
    })
  })
})
