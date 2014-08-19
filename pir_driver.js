var Device = require('zetta').Device;
var util = require('util');
var bone = require('bonescript');

var PIR = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin || 'P8_19';
};
util.inherits(PIR, Device);

PIR.prototype.init = function(config) {
  config
    .state('undetermined')
    .type('pir')
    .name('PIR Sensor');
  
  var self = this;
  bone.pinMode(this.pin, bone.INPUT);
  bone.attachInterrupt(this.pin, true, bone.CHANGE, function(x) {
    if (x.value === 0) {
      self.state = 'motion';
    } else {
      self.state = 'no-motion';
    }
  });
};

