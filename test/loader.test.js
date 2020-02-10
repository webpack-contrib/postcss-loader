const { webpack } = require('@webpack-utilities/test')
describe('Loader', () => {
  test('Default', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          plugins: []
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual('module.exports = "a { color: black }\\n"')
      expect(source).toMatchSnapshot()
    })
  })

  test.only('uses previous AST', () => {
    const spy = jest.fn()
    const config = {
      rules: [
        {
          test: /style\.js$/,
          use: [
            {
              loader: require.resolve('../src'),
              options: { importLoaders: 1 }
            },
            {
              loader: require.resolve('./ast-loader'),
              options: { spy }
            }
          ]
        }
      ]
    }

    return webpack('jss/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(spy).toHaveBeenCalledTimes(1)
      expect(source).toMatchSnapshot()
    })
  })
})
