/**
 * **PostCSS Syntax Error**
 *
 * Loader wrapper for postcss syntax errors
 *
 * @class SyntaxError
 * @extends Error
 *
 * @param {Object} err CssSyntaxError
 */
class SyntaxError extends Error {
  constructor (err) {
    super(err)

    const { line, column, reason } = err

    this.name = 'SyntaxError'

    this.message = ''
    this.message += `${this.name} \n\n(${line}:${column}) ${reason}`
    this.message += `\n\n${err.showSourceCode()}\n`

    this.stack = false
  }
}

module.exports = SyntaxError
