var path = require('path');

var RewritePlugin = require('./support/webpack-plugins/rewrite.js');

module.exports = {
    target :  'node',
    context: __dirname,
    entry  :   './test-default.js',
    output :  {
        path:     path.join(__dirname, '..', 'build')
    },
    plugins: [
        new RewritePlugin()
    ]
};
