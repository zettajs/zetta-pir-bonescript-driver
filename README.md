##Monitor a PIR Sensor using Zetta and bonescript!

###Install

```
$> npm install zetta-pir-bonescript-driver
```

###Usage

```
var zetta = require('zetta');
var PIR = require('zetta-pir-bonescript-driver');

zetta()
  .use(PIR)
  .listen(1337)
```

