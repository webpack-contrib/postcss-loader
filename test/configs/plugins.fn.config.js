module.exports = {
  file: 'plugins.fn',
  options: {
    plugins: () => [
      require('../plugin')()
    ]
  }
}
