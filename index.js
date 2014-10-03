var loaderUtils = require('loader-utils');
var postcss     = require('postcss');

module.exports = function (source) {
    if ( this.cacheable ) this.cacheable();

    var file    = loaderUtils.getRemainingRequest(this);
    var options = { from: file, to: file };

    var processed = postcss().process(source, options);
    this.callback(null, processed.css, processed.map);
};
