'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('my-plugin', (options) => {
  const myOptions = {...{ alpha: '1.0', color: 'black' }, ...options};

  return (root, result) => {
    root.walkDecls((decl) => {
      if (decl.value === myOptions.color) {
        decl.value = 'rgba(0, 0, 0, ' + myOptions.alpha + ')'
      }
    })
  }
});
