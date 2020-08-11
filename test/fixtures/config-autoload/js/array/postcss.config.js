module.exports = function (ctx) {
  return {
    parser: ctx.parser ? 'sugarss' : false,
    syntax: ctx.syntax ? 'sugarss' : false,
    map: ctx.map ? 'inline' : false,
    from: './test/js/array/fixtures/index.css',
    to: './test/js/array/expect/index.css',
    plugins: [
      require('postcss-import')(),
      require('postcss-nested')(),
      ctx.env === 'production' ? require('cssnano')() : false
    ]
  }
}
