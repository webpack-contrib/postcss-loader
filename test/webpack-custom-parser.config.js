var path = require('path');
var sugarss = require('sugarss');

var blue  = require('./support/plugins/blue');
var red  = require('./support/plugins/red');

var RewritePlugin = require('./support/webpack-plugins/rewrite.js');

module.exports = {
    target :  'node',
    context: __dirname,
    entry  :   './test-custom-parser.js',
    output :  {
        path: path.join(__dirname, '..', 'build')
    },
    postcss: function () {
        return {
            syntax: sugarss,
            plugins: [blue, red({ alpha: 0.1 })]
        };
    },
    plugins: [
        new RewritePlugin()
    ]
};
