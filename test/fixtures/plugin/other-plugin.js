'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('my-plugin', (options) => {
  options = Object.assign({ alpha: '1.0' }, options);

  return (root, result) => {
    root.walkDecls((decl) => {
      if (decl.value === 'blue') {
        decl.value = 'rgba(0, 0, 255, ' + options.alpha + ')'
      }
    })
  }
});
