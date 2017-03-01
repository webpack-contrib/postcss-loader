'use strict'

const path = require('path')

module.exports = (config) => {
  config = JSON.parse(config)

  if (config.options && config.options.plugins) {
    config.options.plugins = [ require('./plugin')() ]
  }

  return {
    target: 'node',
    devtool: 'source-map',
    context: path.join(__dirname, 'configs'),
    entry: `./${config.file}.js`,
    output: {
      path: path.join(__dirname, 'builds'),
      filename: `${config.file}.test.js`
    },
    module: {
      rules: [
        {
          test: /\.(sss|css)$/,
          use: [
            {
              loader: path.resolve('./'),
              options: config.options || {}
            }
          ]
        },
        {
          test: /style\.(exec\.js|js)$/,
          use: [
            {
              loader: path.resolve('./lib'),
              options: config.options || {}
            }
          ]
        }
      ]
    }
  }
}
