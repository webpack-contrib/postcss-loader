var postcssJs = require('postcss-js');

var style = {
    a: {
        color: 'green'
    }
};

module.exports = postcssJs.parse(style);
