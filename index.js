var loaderUtils = require('loader-utils');
var postcss     = require('postcss');

module.exports = function (source) {
    if ( this.cacheable ) this.cacheable();

    var file    = loaderUtils.getRemainingRequest(this);
    var params  = loaderUtils.parseQuery(this.query);

    var opts = { from: file, to: file };
    if ( params.safe ) opts.safe = true;

    var processors = this.options.postcss;

    var processed = postcss.apply(postcss, processors).process(source, opts);
    this.callback(null, processed.css, processed.map);
};
