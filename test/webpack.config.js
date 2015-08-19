var path = require('path');

var blue = require('./plugins/blue');
var red  = require('./plugins/red');

module.exports = {
    target:  'node',
    context: __dirname,
    entry:   './test.js',
    output:  {
        path:     path.join(__dirname, '..', 'build'),
        filename: 'test.js'
    },
    postcss: function () {
        return {
            defaults: [blue, red],
            blues:    [blue]
        };
    }
};
