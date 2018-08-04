const { webpack } = require('@webpack-utilities/test')

describe('Errors', () => {
  test('Validation Error', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          sourceMap: 1
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      // eslint-disable-next-line
      const error = () => eval(source)

      expect(error).toThrow()

      try {
        error()
      } catch (err) {
        const message = err.message
          .split('\n\n')
          .slice(1, -1)
          .join('\n\n')

        expect(message).toMatchSnapshot()
      }
    })
  })

  test('Syntax Error', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          parser: 'sugarss'
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      // eslint-disable-next-line
      const error = () => eval(source)

      expect(error).toThrow()

      try {
        error()
      } catch (err) {
        const message = err.message
          .split('\n')
          .slice(1)
          .join('\n')

        expect(message).toMatchSnapshot()
      }
    })
  })
})
