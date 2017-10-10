'use strict'

const webpack = require('../helpers/compiler')
const { loader } = require('../helpers/compilation')

describe('Options', () => {
  test('Exec - {Boolean}', () => {
    const config = {
      loader: {
        test: /style\.(exec\.js|js)$/,
        options: {
          exec: true
        }
      }
    }

    return webpack('jss/exec/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a {\\n    color: green\\n}\"")
        expect(src).toMatchSnapshot()
      })
  })

  test('JSS - {String}', () => {
    const config = {
      loader: {
        options: {
          parser: 'postcss-js'
        }
      }
    }

    return webpack('jss/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toMatchSnapshot()
      })
  })
})
