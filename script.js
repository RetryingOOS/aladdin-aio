const bytenode = require('bytenode');
const v8 = require('v8');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const JavaScriptObfuscator = require('javascript-obfuscator');

v8.setFlagsFromString('--no-lazy');
v8.setFlagsFromString('--no-flush-bytecode');
function compileFile(file) {
  if (fs.existsSync(file)) {
    bytenode.compileFile(file);
    console.log(`${file} compiled`);
    fs.unlinkSync(file);
    return;
  }
}

function obfuscateDir(dirPath) {
  var dirents = fs.readdirSync(dirPath, {
    encoding: 'utf8',
    withFileTypes: true,
  });
  for (let i = 0; i < dirents.length; i++) {
    let dirent = dirents[i];

    if (dirent.isDirectory()) {
      obfuscateDir(path.join(dirPath, dirent.name));
      continue;
    }

    if (path.extname(dirent.name) !== '.js') continue;

    let filePath = path.join(dirPath, dirent.name);

    if (!filePath.includes('static')) {
      let content = fs.readFileSync(filePath, { encoding: 'utf8' });

      let obfuscator = JavaScriptObfuscator.obfuscate(content, {
        compact: true,
        simplify: true,
        controlFlowFlattening: false,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.1,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: true,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: false,
        stringArray: true,
        stringArrayEncoding: ['rc4'],
        target: 'node',
        stringArrayThreshold: 0.75,
        transformObjectKeys: false,
        unicodeEscapeSequence: true,
        splitStringsChunkLength: 5,
      });
      let obfuscatedCode = obfuscator.getObfuscatedCode();

      fs.writeFileSync(filePath, obfuscatedCode, {
        encoding: 'utf8',
        flag: 'w+',
      });
    }
  }
}

// obfuscateDir(path.join(__dirname, './build'));

compileFile(path.join(__dirname, './build/preload.js'));
// fs.copyFileSync('./public/electron.js', './build/electron.js');
compileFile(path.join(__dirname, './build/electron.js'));

compileFile(path.join(__dirname, './build/Request.js'));
compileFile(path.join(__dirname, './build/tasks.js'));

compileFile(path.join(__dirname, './build/modules/amazon/amazon-regular.js'));
compileFile(path.join(__dirname, './build/modules/amazon/amazon-mobile.js'));
compileFile(path.join(__dirname, './build/modules/amazon/amazon-smile.js'));
compileFile(path.join(__dirname, './build/modules/amazon/amazon-login.js'));
compileFile(path.join(__dirname, './build/modules/amazon/amazon-monitor.js'));

compileFile(path.join(__dirname, './build/modules/bestbuy/bestbuy.js'));

compileFile(path.join(__dirname, './build/modules/panini/panini.js'));

compileFile(path.join(__dirname, './build/modules/shopify/shopify.js'));

compileFile(path.join(__dirname, './build/modules/target/target.js'));

compileFile(path.join(__dirname, './build/modules/notify.js'));

compileFile(path.join(__dirname, './build/modules/proxyPing.js'));

compileFile(path.join(__dirname, './build/modules/target-login.js'));

compileFile(path.join(__dirname, './build/asar.js'));

// compileFile(path.join(__dirname, './build/Client/dist/index.js'));

try {
  rimraf.sync(path.join(__dirname, './build/Client/golang'));
} catch (e) {}
try {
  rimraf.sync(path.join(__dirname, './build/Client/src'));
} catch (e) {}

try {
  fs.unlinkSync(path.join(__dirname, './build/Client/package.json'));
} catch (e) {}

try {
  fs.unlinkSync(path.join(__dirname, './build/Client/tsconfig.json'));
} catch (e) {}

fs.writeFileSync(
  path.join(__dirname, './build/electron.js'),
  `
  const bytenode = require('bytenode');
  const v8 = require('v8');
  const fs = require('fs');
  
  v8.setFlagsFromString('--no-lazy');
  
  require('./electron.jsc')
`
);

process.exit(0);
