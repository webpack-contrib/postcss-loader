'use strict';

const postcss = require('postcss');

module.exports = {
  default: postcss.plugin('my-plugin', (options) => {
    options = { alpha: '1.0', color: 'blue', ...options };

    return (root, result) => {
      root.walkDecls((decl) => {
        if (decl.value === options.color) {
          decl.value = 'rgba(0, 0, 255, ' + options.alpha + ')'
        }
      })
    }
  }),
};
