'use strict'

const webpack = require('./helpers/compiler')
const { loader } = require('./helpers/compilation')
const { copyCssFile, deleteCssFile } = require('./helpers/fileChange');

describe('Loader', () => {
  test('Default', () => {
    const config = {
      loader: {
        options: {
          plugins: []
        }
      }
    }

    return webpack('css/index.js', config).then((stats) => {
        const src = loader(stats).src

        expect(src).toEqual("module.exports = \"a { color: black }\\n\"")
        expect(src).toMatchSnapshot()
      })
  })

  describe('Watching Deps After An Error', () => {
    const files = {
      syntaxError: "css-watching/syntaxError.css",
      noSyntaxError: "css-watching/noSyntaxError.css",
      changingFile: "css-watching/styleDep.css"
    }

    beforeAll(() => copyCssFile(files.noSyntaxError, files.changingFile))

    afterAll(() => deleteCssFile(files.changingFile))

    test('Default', () => {
      const config = {
        loader: {
          options: {
            plugins: [require("postcss-import")],
            watching: true
          }
        }
      }

      const testSteps = [
        (stats) => {
          const { err, src } = loader(stats)
          expect(src).toMatchSnapshot()
          expect(err.length).toEqual(0)
          return copyCssFile(files.syntaxError, files.changingFile)
        },
        (stats) => {
          const { err, src } = loader(stats)
          expect(src).toMatchSnapshot()
          expect(err.length).toEqual(1)
          return copyCssFile(files.noSyntaxError, files.changingFile)
        },
        (stats, close) => {
          const { err, src } = loader(stats)
          expect(src).toMatchSnapshot()
          expect(src).toEqual("module.exports = \"a { color: black }\\n\"")
          expect(err.length).toEqual(0)
          return close()
        }
      ];

      var currentStep = 0

      const options = {
        watching: true,
        handler: (err, stats, close) => {
          testSteps[currentStep](stats, close)
          currentStep++
        }
      }

      return webpack('css-watching/index.js', config, options)
    })
  })

})
