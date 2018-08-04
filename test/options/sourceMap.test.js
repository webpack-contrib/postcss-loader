const path = require('path')
const { webpack } = require('@webpack-utilities/test')

describe('Options', () => {
  test('Sourcemap - {Boolean}', () => {
    const config = {
      devtool: 'sourcemap',
      loader: {
        test: /\.css$/,
        options: {
          sourceMap: true
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual(
        'module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"'
      )

      expect(source).toMatchSnapshot()

      const map = stats.compilation.modules[1]._source._sourceMap

      map.file = path.posix.relative(__dirname, map.file)
      map.sources = map.sources.map(
        (src) => path.posix.relative(__dirname, src)
      )

      expect(map).toMatchSnapshot()
    })
  })

  test('Sourcemap - {String}', () => {
    const config = {
      loader: {
        test: /\.css$/,
        options: {
          sourceMap: 'inline'
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const { source } = stats.toJson().modules[1]

      expect(source).toEqual(
        'module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n\\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZml4dHVyZXMvY3NzL3N0eWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLDJCQUFZLEVBQUUiLCJmaWxlIjoidGVzdC9maXh0dXJlcy9jc3Mvc3R5bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiYSB7IGNvbG9yOiBibGFjayB9XG4iXX0= */"'
      )

      expect(source).toMatchSnapshot()
    })
  })
})
