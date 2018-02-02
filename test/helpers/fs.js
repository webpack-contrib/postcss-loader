const path = require('path')
const promisify = require('util.promisify')

const {
  unlink: _unlink,
  readFile: _readFile,
  writeFile: _writeFile
} = require('fs')

const fs = {
  readFile: promisify(_readFile),
  writeFile: promisify(_writeFile),
  unlink: promisify(_unlink)
}

function readFile (name) {
  const file = path.join(__dirname, '../fixtures', name)

  return fs.readFile(file)
    .then((data) => data.toString())
}

function writeFile (name, data) {
  const file = path.join(__dirname, '../fixtures', name)

  return fs.writeFile(file, data)
}

module.exports.copyFile = function copyFile (src, dest) {
  return readFile(src)
    .then((data) => writeFile(dest, data))
}

module.exports.deleteFile = function deleteFile (name) {
  const file = path.join(__dirname, '../fixtures', name)

  return fs.unlink(file)
}
