'use strict'

const webpack = require('../helpers/compiler')
const { loader } = require('../helpers/compilation')

describe('Options', () => {
  test('Syntax - {String}', () => {
    const config = {
      loader: {
        options: {
          syntax: 'sugarss'
        }
      }
    }

    return webpack('sss/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a\\n  color: black\\n\"")
        expect(src).toMatchSnapshot()
      })
  })
  // TODO fix schema 
  test.skip('Syntax - {Function}', () => {
    const config = {
      loader: {
        options: {
          ident: 'postcss',
          syntax: require('sugarss')
        }
      }
    }

    return webpack('sss/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a\\n  color: black\\n\"")
        expect(src).toMatchSnapshot()
      })
  })
})
