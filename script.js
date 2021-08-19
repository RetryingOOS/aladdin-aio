const bytenode = require('bytenode');
const v8 = require('v8');
const path = require('path');
const fs = require('fs');

v8.setFlagsFromString('--no-lazy');
function compileFile(file) {
  if (fs.existsSync(file)) {
    bytenode.compileFile(file);
    fs.unlinkSync(file);
    return;
  }
  return;
}

compileFile(path.join(__dirname, './build/electron.js'));
// compileFile(path.join(__dirname, './build/preload.js'));
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

// fs.unlinkSync(path.join(__dirname,'../build/electron.js'))
// fs.unlinkSync(path.join(__dirname,'../build/preload.js'))
// fs.unlinkSync(path.join(__dirname,'../build/Request.js'))
// fs.unlinkSync(path.join(__dirname,'../build/tasks.js'))

// fs.unlinkSync(path.join(__dirname,'../build/modules/amazon/amazon-regular.js'))
// fs.unlinkSync(path.join(__dirname,'../build/modules/amazon/amazon-mobile.js'))
// fs.unlinkSync(path.join(__dirname,'../build/modules/amazon/amazon-smile.js'))
// fs.unlinkSync(path.join(__dirname,'../build/modules/amazon/amazon-login.js'))
// fs.unlinkSync(path.join(__dirname,'../build/modules/amazon/amazon-monitor.js'))

// fs.unlinkSync(path.join(__dirname,'../build/modules/bestbuy/bestbuy.js'))

// fs.unlinkSync(path.join(__dirname,'../build/modules/panini/panini.js'))

// fs.unlinkSync(path.join(__dirname,'../build/modules/shopify/shopify.js'))

// fs.unlinkSync(path.join(__dirname,'../build/modules/target/target.js'))

// fs.unlinkSync(path.join(__dirname,'../build/modules/notify.js'))

// fs.unlinkSync(path.join(__dirname,'../build/modules/proxyPing.js'))

// fs.unlinkSync(path.join(__dirname,'../build/modules/target-login.js'))

fs.writeFileSync(
  path.join(__dirname, './build/electron.js'),
  `
  const bytenode = require('bytenode');
  const v8 = require('v8');
  const fs = require('fs');
  
  v8.setFlagsFromString('--no-lazy');
  
  if(fs.existsSync('./electron.js')){
      require('./electron.js')
  }else{
      require('./electron.jsc')
  }
`
);

process.exit(0);
