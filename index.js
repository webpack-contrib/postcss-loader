var loaderUtils = require('loader-utils');
var postcss     = require('postcss');

module.exports = function (source, map) {
    if ( this.cacheable ) this.cacheable();

    var file    = loaderUtils.getRemainingRequest(this);
    var params  = loaderUtils.parseQuery(this.query);

    var opts = {
        from: file, to: file,
        map: {
            inline: false,
            annotation: false
        }
    };
    if ( map ) opts.map.prev     = map;
    if ( params.safe ) opts.safe = true;

    var plugins = this.options.postcss;
    if ( params.pack ) {
        plugins = plugins[params.pack];
    } else if ( !Array.isArray(plugins) ) {
        plugins = plugins.defaults;
    }

    var processed = postcss.apply(postcss, plugins).process(source, opts);
    this.callback(null, processed.css, processed.map);
};
