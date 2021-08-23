
  require('bytenode');
  const v8 = require('v8');
  
  v8.setFlagsFromString('--no-lazy');
  
  require('./electron.jsc')
