'use strict'

const path = require('path')
const postcssrc = require('postcss-load-config')

module.exports = function parseRc (file, options) {
  const rc = {
    path: path.dirname(file),
    ctx: {
      file: {
        extname: path.extname(file),
        dirname: path.dirname(file),
        basename: path.basename(file)
      },
      options: {}
    }
  }

  if (options.config) {
    if (options.config.path) {
      rc.path = path.resolve(options.config.path)
    }

    if (options.config.ctx) {
      rc.ctx.options = options.config.ctx
    }
  }

  return Promise.resolve().then(() => {
    return postcssrc(rc.ctx, rc.path, { argv: false })
  })
}
