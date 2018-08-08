/**
 * **PostCSS Plugin Warning**
 *
 * Loader wrapper for postcss plugin warnings (`root.messages`)
 *
 * @class Warning
 * @extends Error
 *
 * @param {Object} warning PostCSS Warning
 */
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
