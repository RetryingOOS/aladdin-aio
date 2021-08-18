const util = require('util');
const { EventEmitter } = require('events');

const Class = function () {};
util.inherits(Class, EventEmitter);
Class.prototype.notify = function (sku) {
  this.emit('monitor-result', sku);
};
module.exports = Class;
