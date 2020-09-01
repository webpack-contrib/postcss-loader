module.exports = function (ctx) {
  return {
    parser: ctx.parser ? 'sugarss' : false,
    syntax: ctx.syntax ? 'sugarss' : false,
    map: ctx.map ? 'inline' : false,
    from: './test/fixtures/config-autoload/js/object/index.css',
    to: './test/fixtures/config-autoload/js/object/expect/index.css',
    plugins: {
      'postcss-import': {},
      'postcss-nested': {},
      'cssnano': ctx.env === 'production' ? {} : false
    }
  }
};
