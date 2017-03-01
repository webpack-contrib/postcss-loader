'use strict'

const postcss = require('postcss')

module.exports = postcss.plugin('plugin', (options) => {
  options = Object.assign({ alpha: '1.0' }, options)

  return (css, result) => {
    css.walkDecls((decl) => {
      if (decl.value === 'black') {
        decl.value = 'rgba(255, 0, 0, ' + options.alpha + ')'
      }
    })
  }
})
