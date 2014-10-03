var util = require('util');
var AutoScout = require('zetta-auto-scout');
var PIR = require('./pir_driver');

var BoneScout = module.exports = function(pin) {
  AutoScout.call(this, 'pir', PIR, pin);
};
util.inherits(BoneScout, AutoScout);
