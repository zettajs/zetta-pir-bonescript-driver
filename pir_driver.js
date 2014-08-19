var Device = require('zetta').Device;
var util = require('util');
var bone = require('bonescript');

var PIR = module.exports = function(pin) {
  Device.call(this);
  console.log('PIN:', pin)
  this.pin = pin || 'P8_19';
};
util.inherits(PIR, Device);

PIR.prototype.init = function(config) {
  config
    .state('undetermined')
    .type('pir')
    .name('PIR Sensor')
    .when('no-motion', { allow: ['motion'] })
    .when('motion', { allow: ['no-motion'] })
    .map('motion', this.motion)
    .map('no-motion', this.noMotion);
  
  var self = this;
  bone.pinMode(this.pin, bone.INPUT);
  bone.attachInterrupt(this.pin, true, bone.CHANGE, function(x) {
    if (x.value === 0) {
      self.call('motion');
    } else {
      self.call('no-motion');
    }
  });
};

PIR.prototype.motion = function(cb) {
  this.state = 'motion';
};

PIR.prototype.noMotion = function(cb) {
  this.state = 'no-motion';
};
