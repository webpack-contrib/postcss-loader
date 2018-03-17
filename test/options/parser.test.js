'use strict'

const webpack = require('../helpers/compiler')
const { loader } = require('../helpers/compilation')

describe('Options', () => {
  test('Parser - {String}', () => {
    const config = {
      loader: {
        options: {
          parser: 'sugarss',
          postcssrc: false
        }
      }
    }

    return webpack('sss/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a {\\n  color: black\\n}\\n\"")
        expect(src).toMatchSnapshot()
      })
  })

  test('Parser - {Object}', () => {
    const config = {
      loader: {
        options: {
          ident: 'postcss',
          parser: require('sugarss'),
          postcssrc: false
        }
      }
    }

    return webpack('sss/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a {\\n  color: black\\n}\\n\"")
        expect(src).toMatchSnapshot()
      })
  })
})
