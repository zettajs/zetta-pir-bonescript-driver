var zetta = require('zetta');
var PIR = require('../index');

zetta()
  .use(PIR, 'P8_19')
  .listen(3000, function() {
    console.log('Listening on port 3000')
  });
