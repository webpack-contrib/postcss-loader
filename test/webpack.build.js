'use strict'

const fs = require('fs-extra')
const path = require('path')

const webpack = require('webpack')

const builds = path.join(__dirname, 'builds')

if (fs.existsSync(builds)) fs.remove(builds)

fs.readdirSync(path.join(__dirname, 'configs'))
  .filter((file) => path.extname(file) === '.js' && path.extname(path.basename(file, '.js')) === '.config')
  .forEach((config) => {
    config = require(path.join(__dirname, 'configs', config))
    config = require(path.join(__dirname, 'webpack.config.js'))(config)

    webpack(config, () => {})
  })
