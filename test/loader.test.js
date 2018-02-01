'use strict'

const webpack = require('./helpers/compiler')
const { loader } = require('./helpers/compilation')
const { copyFile, deleteFile } = require('./helpers/fs');

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

  describe('Watching', () => {
    const files = {
      syntaxError: "watch/watching/syntaxError.css",
      noSyntaxError: "watch/watching/noSyntaxError.css",
      changingFile: "watch/watching/styleDep.css"
    }

    beforeAll(() => copyFile(files.noSyntaxError, files.changingFile))

    afterAll(() => deleteFile(files.changingFile))

    test('Default', () => {
      const config = {
        loader: {
          options: {
            plugins: [require("postcss-import")],
          }
        }
      }

      const steps = [
        (stats) => {
          const { err, src } = loader(stats)

          expect(src).toMatchSnapshot()
          expect(err.length).toEqual(0)

          return copyFile(files.syntaxError, files.changingFile)
        },
        (stats) => {
          const { err, src } = loader(stats)

          expect(src).toMatchSnapshot()
          expect(err.length).toEqual(1)

          return copyFile(files.noSyntaxError, files.changingFile)
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
        watch (err, stats, close) {
          steps[currentStep](stats, close)
          currentStep++
        }
      }

      return webpack('watch/watching/index.js', config, options)
    })
  })
})
