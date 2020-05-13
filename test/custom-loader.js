const loader = require('../src')

module.exports = loader.custom(postcss => ({
  customOptions: ({ resultSpy, configSpy, ...loader }) => ({
    custom: { resultSpy, configSpy },
    loader
  }),

  config: (config, options) => {
    options.customOptions.configSpy(config, options)
    return config
  },

  result: ((result, options) => {
    options.customOptions.resultSpy(result, options)

    return result
  })
}))
