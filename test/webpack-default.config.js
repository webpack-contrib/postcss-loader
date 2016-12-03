var path = require('path');

var RewritePlugin = require('./webpack-plugins/rewrite.js');

module.exports = {
    target:  'node',
    context: __dirname,
    entry:   './test-default.js',
    output:  {
        filename: 'test-default.test.js',
        path: path.join(__dirname, '..', 'build')
    },
    plugins: [
        new RewritePlugin()
    ]
};
