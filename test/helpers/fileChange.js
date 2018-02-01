const path = require('path')
const { readFile, writeFile, unlink } = require('fs')
const promisify = require('util.promisify')

const rf = promisify(readFile)
const wf = promisify(writeFile)
const rm = promisify(unlink)

function readCssFile (name) {
  const fileName = path.join(__dirname, '../fixtures', name)

  return rf(fileName)
    .then(c => c.toString())
}

function writeCssFile (name, contents) {
  const fileName = path.join(__dirname, '../fixtures', name)

  return wf(fileName, contents)
}

module.exports.copyCssFile = function copyCssFile (src, dest) {
  return readCssFile(src)
    .then(contents => writeCssFile(dest, contents))
}

module.exports.deleteCssFile = function deleteCssFile (name) {
  const fileName = path.join(__dirname, '../fixtures', name)

  return rm(fileName)
}
