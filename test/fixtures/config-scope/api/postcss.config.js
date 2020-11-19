module.exports = function (api) {
  if (!api.mode) {
    throw new Error(`Failed, no ${api.mode} API`);
  }

  if (!api.file) {
    throw new Error(`Failed, no ${api.file} API`);
  }

  if (!api.webpackLoaderContext) {
    throw new Error(`Failed, no ${api.webpackLoaderContext} API`);
  }

  if (!api.env) {
    throw new Error(`Failed, no ${api.env} API`);
  }

  if (!api.options) {
    throw new Error(`Failed, no ${api.options} API`);
  }
  
  return {
    plugins: [['postcss-short', { prefix: 'x' }]],
  }
};
