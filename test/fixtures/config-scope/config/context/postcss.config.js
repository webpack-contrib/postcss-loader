module.exports = (ctx) => ({
  postcssOptions: {
    plugins: [
      require('./plugin')(ctx)
    ]
  },
})
