'use strict'

const webpack = require('./helpers/compiler')
const { loader } = require('./helpers/compilation')

describe('Loader', () => {
  test('Default', () => {
    const _ = /style\.(exec\.js|js)$/
    const config = {
      loader: {
        options: {
          plugins: []
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a { color: black }\\n\"")
        expect(src).toMatchSnapshot()
      })
  })
})
