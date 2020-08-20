const postcss = require('postcss');

const customPlugin = (ctx) => (css, result) => {
  ctx.webpack._compilation.assets['asset.txt'] = {
    source () {
      return '123'
    },
    size () {
      return 0
    }
  }
};

module.exports = postcss.plugin('plugin', customPlugin);
