var path = require('path');

var blue  = require('./support/plugins/blue');
var red  = require('./support/plugins/red');
var RewritePlugin = require('./support/webpack-plugins/rewrite.js');

module.exports = {
    target :  'node',
    context: __dirname,
    entry  :   './test-explicit-plugins.js',
    output :  {
        path: path.join(__dirname, '..', 'build')
    },
    postcss: function () {
        return [blue, red({ alpha: 0.1 })];
    },
    plugins: [
        new RewritePlugin()
    ]
};
