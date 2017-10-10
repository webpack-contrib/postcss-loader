'use strict'

const webpack = require('./helpers/compiler')
const { loader } = require('./helpers/compilation')

describe('Errors', () => {
  test('Validation Error', () => {
    const loader = require('../lib')

    const error = () => loader.call({ query: { sourceMap: 1 } })

    expect(error).toThrow()
    expect(error).toThrowErrorMatchingSnapshot()
  })

  test('Syntax Error', () => {
    const config = {
      loader: {
        options: {
          parser: 'sugarss'
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
      const error = loader(stats).err

      expect(error[0]).toMatchSnapshot()
    })
  })
})
