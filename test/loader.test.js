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
})
