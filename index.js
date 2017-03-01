const path = require('path');
const loaderUtils = require('loader-utils');

const postcss = require('postcss');
const postcssrc = require('postcss-load-config');

const PostCSSLoaderError = require('./error');

function parseOptions(params) {
    if (typeof params === 'function') {
        params = params.call(this, this);
    }

    console.log('params', params);

    let plugins;

    if (typeof params === 'undefined') {
        plugins = [];
    } else if (Array.isArray(params)) {
        plugins = params;
    } else {
        plugins = params.plugins || params.defaults;
    }

    console.log('plugins', plugins);

    let options = {};

    if (typeof params !== 'undefined') {
        options.parser = params.parser;
        options.syntax = params.syntax;
        options.stringifier = params.stringifier;
    }

    // console.log('options', options);

    let exec = params && params.exec;

    // console.log('exec', exec);

    return Promise.resolve({ options: options, plugins: plugins, exec: exec });
}

module.exports = function (css, map) {
    if (this.cacheable) this.cacheable();

    const loader = this;

    const file = loader.resourcePath;
    const params = loaderUtils.getOptions(loader) || {};

    const settings = params.plugins || loader.options.postcss;

    const callback = loader.async();

    let rc;
    let context = {
        extname: path.extname(file),
        dirname: path.dirname(file),
        basename: path.basename(file),
        webpack: { watch: loader.addDependency }
    };

    params.config ?
      rc = path.resolve(params.config) :
      rc = path.dirname(file);

    Promise.resolve().then(() => {
        if (typeof settings !== 'undefined') {
            return parseOptions.call(loader, settings);
        }

        return postcssrc(context, rc, { argv: false });
    }).then((config) => {
        if (!config) config = {};

        if (config.file) loader.addDependency(config.file);

        console.log('Config Plugins', config.plugins);

        let plugins = config.plugins || [];

        console.log('Plugins', plugins);
        console.log('webpack Version', process.env.WEBPACK_VERSION);

        let options = Object.assign({}, config.options, {
            from: file,
            to: file,
            map:  {
                inline: params.sourceMap === 'inline',
                annotation: false
            }
        });

        if (typeof map === 'string') map = JSON.parse(map);
        if (map && map.mappings) options.map.prev = map;

        if (typeof options.syntax === 'string') {
            options.syntax = require(options.syntax);
        }

        if (typeof options.parser === 'string') {
            options.parser = require(options.parser);
        }

        if (typeof options.stringifier === 'string') {
            options.stringifier = require(options.stringifier);
        }

        // console.log('Options', options);

        let exec = options.exec || config.exec;

        if (options.parser === 'postcss-js' || exec) {
            css = loader.exec(css, loader.resource);
        }

        // Allow plugins to add or remove postcss plugins
        if ( loader._compilation ) {
            plugins = loader._compilation.applyPluginsWaterfall(
              'postcss-loader-before-processing',
              [].concat(plugins),
              options
            );
        }

        return postcss(plugins)
          .process(css, options)
          .then((result) => {
              result.warnings().forEach((msg) => {
                  loader.emitWarning(msg.toString());
              });

              result.messages.forEach((msg) => {
                  if (msg.type === 'dependency') {
                      loader.addDependency(msg.file);
                  }
              });

              callback(
                null, result.css, result.map ? result.map.toJSON() : null
              );

              // console.log('Index', loader.loaderIndex);

              return null;
          });
    }).catch((error) => {
        return error.name === 'CssSyntaxError' ?
            callback(new PostCSSLoaderError(error)) :
            callback(error);
    });
};
