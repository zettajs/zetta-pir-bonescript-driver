var Device = require('zetta').Device;
var util = require('util');
var bone = require('bonescript');

var MOTION_THRESHOLD = 2500; // ms

var PIR = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin || 'P8_19';
};
util.inherits(PIR, Device);

PIR.prototype.init = function(config) {
  config
    .state('undetermined')
    .type('pir')
    .name('PIR Sensor')
    .when('undetermined', { allow: ['motion', 'no-motion'] })
    .when('no-motion', { allow: ['motion'] })
    .when('motion', { allow: ['no-motion'] })
    .map('motion', this.motion)
    .map('no-motion', this.noMotion);
  
  var self = this;
  var timer = null;
  bone.pinMode(this.pin, bone.INPUT);
  bone.attachInterrupt(this.pin, true, bone.CHANGE, function(x) {
    if (x.value === undefined) {
      return;
    }
    if (x.value === 0) {
      clearTimeout(timer);
      timer = null;
      self.call('motion', function() {});
    } else if (timer === null) {
      timer = setTimeout(function() {
        self.call('no-motion', function() {});
      }, MOTION_THRESHOLD);
    }
  });
};

PIR.prototype.motion = function(cb) {
  this.state = 'motion';
  cb();
};

PIR.prototype.noMotion = function(cb) {
  this.state = 'no-motion';
  cb();
};
