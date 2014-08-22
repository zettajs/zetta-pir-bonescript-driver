var Device = require('zetta').Device;
var util = require('util');
var bone = require('bonescript');

var MOTION_THRESHOLD = 500; // ms
var READ_INTERVAL = 50;
var PinStates = {
  0: 'motion',
  1: 'no-motion'
};

var PIR = module.exports = function(pin) {
  Device.call(this);
  this.pin = pin || 'P9_12';
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
  
  function checkPin(x) {
    if (x.err || x.value === undefined) {
      return;
    }

    if (self.state === 'undetermined') {
      self.call(PinStates[x.value], function() {});
    }

    // state changed
    if (self.state !== PinStates[x.value] && timer === null) {
      timer = setTimeout(function() {
        self.call(PinStates[x.value], function() {});
      }, MOTION_THRESHOLD);
    } else if (self.state === PinStates[x.value]){
      clearTimeout(timer);
      timer = null;
    }
  }

  setInterval(function(){
    bone.digitalRead(self.pin, checkPin);
  }, READ_INTERVAL);
};

PIR.prototype.motion = function(cb) {
  this.state = 'motion';
  cb();
};

PIR.prototype.noMotion = function(cb) {
  this.state = 'no-motion';
  cb();
};
