class Warning extends Error {
  constructor (warning) {
    super()

    const { text, line, column } = warning

    this.name = 'LoaderWarning'
    this.message = `\n(${line}:${column}) ${text}\n`

    this.stack = false
  }
}

module.exports = Warning
