
const loader = require('../src')

const incomingVersion = semver.inc(postcssPkg.version, 'minor')

module.exports = loader.custom(postcss => ({
  customOptions: ({ resultSpy, configSpy, ...loader }) => ({
    custom: { spy },
    loader
  }),

  config: (config, options) => {
    options.customOptions.configSpy(config options)
    return config
  },

  resul: ((result,options) => {

    options.customOptions.resultSpy(config options)
    return result
  })
}))
