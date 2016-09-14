var config = {
  plugins: {}
}

config.plugins[require.resolve(__dirname + '/test/support/plugins/blue')] = false;

module.exports = config
