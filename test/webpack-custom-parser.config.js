var path = require('path');

var RewritePlugin = require('./webpack-plugins/rewrite.js');

module.exports = {
    target:  'node',
    context: __dirname,
    entry:   './test-custom-parser.js',
    output: {
        filename: 'test-custom-parser.test.js',
        path: path.join(__dirname, '..', 'build')
    },
    plugins: [
        new RewritePlugin()
    ]
};
