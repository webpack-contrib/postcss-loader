const { webpack } = require('@webpack-utilities/test')

describe('Custom Loader', () => {
  test('Default', () => {
    const configSpy = jest.fn((config, options) => {
      expect(config.plugins).toHaveLength(1)
      expect(options.source).toContain('color: black')
    });

    const resultSpy = jest.fn((result) => {
      expect(result.css).toContain('color: rgba(255, 0, 0, 1.0)')
    });

    const config = {
      rules: [
        {
          test: /\.css$/,
          use: {
            loader: require.resolve('./custom-loader'),
            options: { configSpy, resultSpy }
          }
        }
      ]
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual('module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"')

      expect(configSpy).toHaveBeenCalledTimes(1)
      expect(resultSpy).toHaveBeenCalledTimes(1)
    })
  })
})
