var zetta = require('zetta');
var PIR = require('../index');

zetta()
  .use(PIR, 'P9_12')
  .listen(1337);
