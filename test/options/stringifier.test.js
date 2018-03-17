'use strict'

const webpack = require('../helpers/compiler')
const { loader } = require('../helpers/compilation')

describe('Options', () => {
  test('Stringifier - {String}', () => {
    const config = {
      loader: {
        options: {
          stringifier: 'sugarss',
          postcssrc: false
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a  color: black\\n\"")
        expect(src).toMatchSnapshot()
      })
  })

  test('Stringifier - {Object}', () => {
    const config = {
      loader: {
        options: {
          ident: 'postcss',
          stringifier: require('sugarss'),
          postcssrc: false
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a  color: black\\n\"")
        expect(src).toMatchSnapshot()
      })
  })
})
