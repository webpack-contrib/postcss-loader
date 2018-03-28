'use strict'

const webpack = require('../helpers/compiler')
const { loader } = require('../helpers/compilation')

describe('Options', () => {
  test('Parser - {String}', () => {
    const config = {
      loader: {
        options: {
          parser: 'sugarss'
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
          parser: require('sugarss')
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

test('Parser - {Function}', () => {
  const config = {
    loader: {
      options: {
        ident: 'postcss',
        parser: (css, opts) => opts.from.match(/\.sss$/)
          ? require('sugarss').parse(css)
          : require('postcss').parse(css)
      }
    }
  }

  return webpack('sss/index.js', config).then((stats) => {
      const src = loader(stats).src

      expect(src).toEqual("module.exports = \"a {\\n  color: black\\n}\\n\"")
      expect(src).toMatchSnapshot()

      return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src
  
        expect(src).toEqual("module.exports = \"a { color: black }\\n\"")
        expect(src).toMatchSnapshot()
      })
    })
})
