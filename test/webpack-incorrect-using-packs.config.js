var path = require('path');

var RewritePlugin = require('./webpack-plugins/rewrite.js');

module.exports = {
    target:  'node',
    context: __dirname,
    entry:   './test-incorrect-using-packs.js',
    output:  {
        filename: 'test-incorrect-using-packs.test.js',
        path: path.join(__dirname, '..', 'build')
    },
    plugins: [
        new RewritePlugin()
    ]
};
