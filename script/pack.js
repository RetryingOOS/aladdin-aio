const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const asar = require('asar')
const getPath = require('./path.js')

const key = Buffer.from(fs.readFileSync(getPath('source/key.txt'), 'utf8').trim().split(',').map(v => Number(v.trim())))

exports.default = async ({ appOutDir, packager }) => {
console.log(packager.getResourcesDir(appOutDir), '\n')
const asarTarget = path.join(packager.getResourcesDir(appOutDir), 'app.asar');
asar.createPackageWithOptions(getPath('./build'), asarTarget, {
  unpack: '*.node',
  transform (filename) {
    if (path.extname(filename) === '.jsc' || path.extname(filename) === '.js' && path.basename(filename) !== 'hack.js') {
      const iv = crypto.randomBytes(16)
      var append = false
      var cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
      cipher.setAutoPadding(true)
      cipher.setEncoding('base64')

      const _p = cipher.push
      cipher.push = function (chunk, enc) {
        if (!append && chunk != null) {
          append = true
          return _p.call(this, Buffer.concat([iv, chunk]), enc)
        } else {
          return _p.call(this, chunk, enc)
        }
      }
      return cipher
    }
  }
})

const target = process.platform === 'darwin' ? getPath(`test/Electron.app/Contents/Resources/node_modules.asar`) : getPath('./test/resources/node_modules.asar')
asar.createPackageWithOptions(getPath('node_modules_asar'), target, {
  unpack: '*.node'
})
}