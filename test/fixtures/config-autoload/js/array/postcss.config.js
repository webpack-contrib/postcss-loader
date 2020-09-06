module.exports = function (api) {
  return {
    parser: 'sugarss',
    syntax: 'sugarss',
    map: api.mode === 'development' ? 'inline' : false,
    from: './test/fixtures/config-autoload/js/object/index.css',
    to: './test/fixtures/config-autoload/js/object/expect/index.css',
    plugins: [
      'postcss-import',
      [
        'postcss-nested',
        {
          // Options
        }
      ]
    ]
  }
};
