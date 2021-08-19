
  const bytenode = require('bytenode');
  const v8 = require('v8');
  const fs = require('fs');
  
  v8.setFlagsFromString('--no-lazy');
  
  if(fs.existsSync('./electron.js')){
      require('./electron.js')
  }else{
      require('./electron.jsc')
  }
