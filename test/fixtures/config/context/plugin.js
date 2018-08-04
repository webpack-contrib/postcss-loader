'use strict'

const postcss = require('postcss')

// This plugin creates asset file in webpack compilation
module.exports = postcss.plugin('plugin', (ctx) => {
  ctx.webpack._compilation.assets['asset.txt'] = {
    source () {
      return '123'
    },
    size () {
      return 0
    }
  }
})
