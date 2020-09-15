module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-new-api-plugin',
    Declaration: {
      width: (node) => {
        node.value = '100px';
      },
    },
  };
};
module.exports.postcss = true;
