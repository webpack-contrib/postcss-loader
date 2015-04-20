var loaderUtils = require('loader-utils');
var postcss     = require('postcss');

module.exports = function (source, map) {
    if ( this.cacheable ) this.cacheable();

    var file    = loaderUtils.getRemainingRequest(this);
    var params  = loaderUtils.parseQuery(this.query);

    var opts = { from: file, to: file, map: { prev: map, inline: false } };
    if ( params.safe ) opts.safe = true;

    var processors = this.options.postcss;
    if ( params.pack ) {
        processors = processors[params.pack];
    } else if ( !Array.isArray(processors) ) {
        processors = processors.defaults;
    }

    var processed = postcss.apply(postcss, processors).process(source, opts);
    this.callback(null, processed.css, processed.map);
};
