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
    describe('Dependencies', () => {
      const files = {
        css: 'watch/index.css',
        error: 'watch/error.css',
        changed: 'watch/import.css'
      }

      beforeEach(() => copyFile(files.css, files.changed))

      afterEach(() => deleteFile(files.changed))

      test('Error', () => {
        const config = {
          loader: {
            options: {
              plugins: [
                require('postcss-import')
              ],
            }
          }
        }

        const steps = [
          (stats) => {
            const { err, src } = loader(stats)

            expect(src).toMatchSnapshot()
            expect(err.length).toEqual(0)

            return copyFile(files.error, files.changed)
          },
          (stats) => {
            const { err, src } = loader(stats)

            expect(src).toMatchSnapshot()
            expect(err.length).toEqual(1)

            return copyFile(files.css, files.changed)
          },
          (stats, close) => {
            const { err, src } = loader(stats)

            expect(src).toMatchSnapshot()
            expect(src).toEqual("module.exports = \"a { color: black }\\n\"")
            expect(err.length).toEqual(0)

            return close()
          }
        ]

        let step = 0

        const options = {
          watch (err, stats, close) {
            steps[step](stats, close)

            step++
          }
        }

        return webpack('watch/index.js', config, options)
      })
    })
  })
})
