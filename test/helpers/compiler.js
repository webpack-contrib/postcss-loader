'use strict'

const path = require('path')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')

module.exports = function compiler (fixture, config, options) {
  config = {
    devtool: config.devtool || 'sourcemap',
    context: path.resolve(__dirname, '..', 'fixtures'),
    entry: `./${fixture}`,
    output: {
      path: path.resolve(
        __dirname,
        `../results/${config.path ? config.path : ''}`
      ),
      filename: '[name].bundle.js'
    },
    module: {
      rules: config.rules || config.loader
        ? [
          {
            test: config.loader.test || /\.(css|sss)$/,
            use: {
              loader: path.resolve(__dirname, '../../lib'),
              options: config.loader.options || {}
            }
          }
        ]
        : []
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: [ 'runtime' ],
        minChunks: Infinity
      })
    ].concat(config.plugins || [])
  }

  options = Object.assign({ emit: false }, options)

  const compiler = webpack(config)

  if (!options.emit) compiler.outputFileSystem = new MemoryFS()

  if (options.watch) {
    return new Promise((resolve, reject) => {
      const watcher = compiler.watch({}, (err, stats) => {
        options.watch(err, stats, () => {
          watcher.close(resolve)
        })
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      return compiler.run((err, stats) => {
        if (err) reject(err)

        resolve(stats)
      })
    })
  }
}
