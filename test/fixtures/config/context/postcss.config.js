module.exports = (ctx) => ({
  plugins: [
    require('./plugin')(ctx)
  ]
})
