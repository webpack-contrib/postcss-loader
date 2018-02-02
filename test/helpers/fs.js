const path = require('path')
const { readFile: _readFile, writeFile: _writeFile, unlink: _unlink } = require('fs')
const promisify = require('util.promisify')

const fs = {
  readFile: promisify(_readFile),
  writeFile: promisify(_writeFile),
  unlink: promisify(_unlink)
}

function readFile (name) {
  const file = path.join(__dirname, '../fixtures', name)

  return fs.readFile(file)
    .then(data => data.toString())
}

function writeFile (name, contents) {
  const file = path.join(__dirname, '../fixtures', name)

  return fs.writeFile(file, contents)
}

module.exports.copyFile = function copyFile (src, dest) {
  return readFile(src)
    .then(contents => writeFile(dest, contents))
}

module.exports.deleteFile = function deleteFile (name) {
  const file = path.join(__dirname, '../fixtures', name)

  return fs.unlink(file)
}
