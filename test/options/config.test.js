'use strict'

const webpack = require('../helpers/compiler')
const { loader } = require('../helpers/compilation')

describe('Options', () => {
  test('Config - {Object}', () => {
    const config = {
      loader: {}
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a { color: rgba(255, 0, 0, 1.0) }\\n\"")
        expect(src).toMatchSnapshot()
      })
  })

  test('Config - {Object} - with postcssrc false', () => {
    const config = {
      loader: {
        options: {
          postcssrc: false
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a { color: black }\\n\"")
        expect(src).toMatchSnapshot()
      })
  })

  test('Config - Path - {String}', () => {
    const config = {
      loader: {
        options: {
          config: { path: 'test/fixtures/config/postcss.config.js' }
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a { color: black }\\n\"")
        expect(src).toMatchSnapshot()
      })
  })

  test('Config - Context - {Object}', () => {
    const config = {
      loader: {
        options: {
          config: {
            path: 'test/fixtures/config/postcss.config.js',
            ctx: { plugin: true }
          }
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a { color: rgba(255, 0, 0, 1.0) }\\n\"")
        expect(src).toMatchSnapshot()
      })
  })


  test('Config - Context - {Object} - with ident', () => {
    const config = {
      loader: {
        options: {
          ident: 'postcss',
          config: {
            path: 'test/fixtures/config/postcss.config.js',
            ctx: { plugin: true }
          }
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a { color: rgba(255, 0, 0, 1.0) }\\n\"")
        expect(src).toMatchSnapshot()
      })
  })

  test('Config - with bad option', () => {
    const config = {
      loader: {
        options: {
          unsupportedOption: true,
          postcssrc: false
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
