var loaderUtils = require('loader-utils');
var postcss     = require('postcss');

function PostCSSLoaderError(error) {
    Error.call(this);
    Error.captureStackTrace(this, PostCSSLoaderError);
    this.name = 'Syntax Error';
    this.error = error.input.source;
    this.message = error.reason;
    if ( error.line ) {
        this.message += ' (' + error.line + ':' + error.column + ')';
    }
    if ( error.line && error.input.source ) {
        this.message += '\n\n' + error.showSourceCode() + '\n';
    }
    this.hideStack = true;
}

PostCSSLoaderError.prototype = Object.create(Error.prototype);
PostCSSLoaderError.prototype.constructor = PostCSSLoaderError;

module.exports = function (source, map) {
    if ( this.cacheable ) this.cacheable();

    var file   = this.resourcePath;
    var params = loaderUtils.parseQuery(this.query);

    var opts = {
        from: file,
        to:   file,
        map:  {
            inline:     params.sourceMap === 'inline',
            annotation: false
        }
    };

    if ( typeof map === 'string' ) map = JSON.parse(map);
    if ( map && map.mappings ) opts.map.prev = map;

    var options = this.options.postcss;
    if ( typeof options === 'function' ) {
        options = options.call(this, this);
    }

    var plugins;
    var exec;
    if ( typeof options === 'undefined' ) {
        plugins = [];
    } else if ( Array.isArray(options) ) {
        plugins = options;
    } else {
        plugins = options.plugins || options.defaults;
        opts.stringifier = options.stringifier;
        opts.parser      = options.parser;
        opts.syntax      = options.syntax;
        exec             = options.exec;
    }
    if ( params.pack ) {
        plugins = options[params.pack];
        if ( !plugins ) {
            throw new Error('PostCSS plugin pack is not defined in options');
        }
    }

    if ( params.syntax ) {
        opts.syntax = require(params.syntax);
    }
    if ( params.parser ) {
        opts.parser = require(params.parser);
    }
    if ( params.stringifier ) {
        opts.stringifier = require(params.stringifier);
    }
    if ( params.exec ) {
        exec = params.exec;
    }

    var loader   = this;
    var callback = this.async();

    if ( params.parser === 'postcss-js' || exec ) {
        source = this.exec(source, this.resource);
    }

    // Allow plugins to add or remove postcss plugins
    plugins = this._compilation.applyPluginsWaterfall(
        'postcss-loader-before-processing',
        [].concat(plugins),
        params
    );

    postcss(plugins).process(source, opts)
        .then(function (result) {
            result.warnings().forEach(function (msg) {
                loader.emitWarning(msg.toString());
            });
            callback(null, result.css, result.map ? result.map.toJSON() : null);
            return null;
        })
        .catch(function (error) {
            if ( error.name === 'CssSyntaxError' ) {
                callback(new PostCSSLoaderError(error));
            } else {
                callback(error);
            }
        });
};
