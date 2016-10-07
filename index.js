var loaderUtils = require('loader-utils');
var postcss     = require('postcss');
var assign = require('./lib/assign');
var getConfiguration = require('./lib/configuration');

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

    var options  = params.plugins || this.options.postcss;
    var pack     = params.pack;
    var loader   = this;
    var callback = this.async();

    getConfiguration(options, pack, function (err, config) {
        if (err) {
            callback(err);
            return;
        }

        var plugins = config.plugins;
        var exec = config.exec;

        var opts  = assign({}, config.options, {
            from: file,
            to  : file,
            map:  {
                inline:     params.sourceMap === 'inline',
                annotation: false
            }
        });

        if ( typeof map === 'string' ) map = JSON.parse(map);
        if ( map && map.mappings ) opts.map.prev = map;

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

        if ( params.parser === 'postcss-js' || exec ) {
            source = loader.exec(source, loader.resource);
        }

        // Allow plugins to add or remove postcss plugins
        if ( loader._compilation ) {
            plugins = loader._compilation.applyPluginsWaterfall(
              'postcss-loader-before-processing',
              [].concat(plugins),
              params
            );
        } else {
            loader.emitWarning(
              'this._compilation is not available thus ' +
              '`postcss-loader-before-processing` is not supported'
            );
        }

        postcss(plugins).process(source, opts)
          .then(function (result) {
              result.warnings().forEach(function (msg) {
                  loader.emitWarning(msg.toString());
              });

              var resultMap = result.map ? result.map.toJSON() : null;
              callback(null, result.css, resultMap);
              return null;
          })
          .catch(function (error) {
              if ( error.name === 'CssSyntaxError' ) {
                  callback(new PostCSSLoaderError(error));
              } else {
                  callback(error);
              }
          });
    });
};
