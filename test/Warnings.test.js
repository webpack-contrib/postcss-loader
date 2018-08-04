const { webpack } = require('@webpack-utilities/test')

const plugin = (options = {}) => (css, result) => {
  css.walkDecls((node) => {
    node.warn(result, '<Message>')
  })
}

describe('Warnings', () => {
  test('Plugins', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          plugins: [
            plugin()
          ]
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const warning = stats.compilation.warnings[0]

      const message = warning.message
        .split('\n')
        .slice(1)
        .join('\n')

      expect(message).toMatchSnapshot()
    })
  })
})
