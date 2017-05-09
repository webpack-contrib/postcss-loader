'use strict'

const postcssJS = require('postcss-js')

const style = {
  a: {
    color: 'green'
  }
}

module.exports = postcssJS.parse(style)
