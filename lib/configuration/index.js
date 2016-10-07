var parseOptions = require('./parse_options');
var loadConfig = require('postcss-load-config');

function loadConfigurationFromRc(pack, callback) {
    if ( pack ) {
        callback(new Error('PostCSS plugin pack is supported ' +
                           'only when config is passed explicitly'));
        return;
    }

    loadConfig()
      .then(function (config) {
          callback(null, { options: config.options, plugins: config.plugins });
      })
      .catch(function (err) {
          callback(err);
      });
}

module.exports = function getConfiguration(options, pack, callback) {
  if ( typeof options === 'undefined' ) {
    loadConfigurationFromRc(pack, callback);
    return;
  }

  parseOptions(options, pack, callback);
};
