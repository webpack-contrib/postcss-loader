const { webpack } = require('@webpack-utilities/test')

describe('Options', () => {
  test('Plugins - {Array}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          ident: 'postcss',
          plugins: [ require('../fixtures/config/plugin')() ]
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

  test('Plugins - {Object}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          ident: 'postcss',
          plugins: require('../fixtures/config/plugin')
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

  test('Plugins - {Function} - {Array}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          ident: 'postcss',
          plugins: () => [ require('../fixtures/config/plugin')() ]
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

  test('Plugins - {Function} - {Object}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          ident: 'postcss',
          plugins: () => require('../fixtures/config/plugin')()
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
})
