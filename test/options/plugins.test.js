'use strict'

const webpack = require('../helpers/compiler')
const { loader } = require('../helpers/compilation')

describe('Options', () => {
  test('Plugins - {Array}', () => {
    const config = {
      loader: {
        options: {
          ident: 'postcss',
          plugins: [ require('../fixtures/config/plugin')() ]
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const src = loader(stats).src

      expect(src).toEqual('module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"')
      expect(src).toMatchSnapshot()
    })
  })

  test('Plugins - {Object}', () => {
    const config = {
      loader: {
        options: {
          ident: 'postcss',
          plugins: require('../fixtures/config/plugin')
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const src = loader(stats).src

      expect(src).toEqual('module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"')
      expect(src).toMatchSnapshot()
    })
  })

  test('Plugins - {Function} - {Array}', () => {
    const config = {
      loader: {
        options: {
          ident: 'postcss',
          plugins: () => [ require('../fixtures/config/plugin')() ]
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const src = loader(stats).src

      expect(src).toEqual('module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"')
      expect(src).toMatchSnapshot()
    })
  })

  test('Plugins - {Function} - {Object}', () => {
    const config = {
      loader: {
        options: {
          ident: 'postcss',
          plugins: () => require('../fixtures/config/plugin')()
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const src = loader(stats).src

      expect(src).toEqual('module.exports = "a { color: rgba(255, 0, 0, 1.0) }\\n"')
      expect(src).toMatchSnapshot()
    })
  })
})
