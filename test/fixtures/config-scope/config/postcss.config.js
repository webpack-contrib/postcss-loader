module.exports = (ctx) => ({
  postcssOptions: {
    plugins: [
      ctx.options.plugin ? require('./plugin')() : false
    ]
  },
})
