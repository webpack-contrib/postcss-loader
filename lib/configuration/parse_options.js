function getPluginsFromOptions(options, pack) {
    var plugins;

    if ( typeof options === 'undefined') {
        plugins = [];
    }
    else if ( Array.isArray(options) ) {
        plugins = options;
    } else {
        plugins = options.plugins || options.defaults;
    }

    if ( pack ) {
        plugins = options[pack];
        if ( !plugins ) {
            throw new Error('PostCSS plugin pack is not defined in options');
        }
    }

    return plugins;
}

module.exports = function parseOptions(options, pack, callback) {
    var exec = options && options.exec;

    if ( typeof options === 'function' ) {
      options = options.call(this, this);
    }

    var plugins = getPluginsFromOptions(options, pack);
    var opts = {};

    if ( typeof options !== 'undefined' ) {
      opts.stringifier = options.stringifier;
      opts.parser      = options.parser;
      opts.syntax      = options.syntax;
    }

    callback(null, { options: opts, plugins: plugins, exec: exec });
}

