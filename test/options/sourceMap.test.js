'use strict'

const path = require('path')
const webpack = require('../helpers/compiler')
const { loader } = require('../helpers/compilation')

describe('Options', () => {
  test('Sourcemap - {Boolean}', () => {
    const config = {
      loader: {
        options: {
          sourceMap: true
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const src = loader(stats).src

      expect(src).toEqual('module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"')
      expect(src).toMatchSnapshot()

      const map = loader(stats).map

      map.file = path.relative(__dirname, map.file)
      map.sources = map.sources.map((src) => path.relative(__dirname, src))

      expect(map).toMatchSnapshot()
    })
  })

  test('Sourcemap - {String}', () => {
    const config = {
      loader: {
        options: {
          sourceMap: 'inline'
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const src = loader(stats).src

      expect(src).toEqual('module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n\\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZml4dHVyZXMvY3NzL3N0eWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLDJCQUFZLEVBQUUiLCJmaWxlIjoidGVzdC9maXh0dXJlcy9jc3Mvc3R5bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiYSB7IGNvbG9yOiBibGFjayB9XG4iXX0= */"')
      expect(src).toMatchSnapshot()
    })
  })
})
