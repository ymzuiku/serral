# Use socket like http

```
npm i --save socket-mit
```

## example

### server:

index.js

```js
const mit = require('socket-mit');
const path = require('path');

// auto load routers/xxx.js and router/xxx/index.js;
// ignore underline begins files, like: _xxx.js
mit.load(path.resolve(__dirname, 'routers'));
mit.listen(4000);
```

routers/hello.js

```js
module.exports = function(data, ws) {
  console.log(data);
  ws.dispatch({ name: 'server:hello-client', age: 100 });
};
```

### client:

```js
const mit = require('socket-mit/client');
var ws = mit('ws://127.0.0.1:4000');
ws.onopen = function() {
  ws.dispatch(
    'hello',
    {
      name: 'client: hello-server',
      age: 200,
    },
    res => {
      console.log('catch-server-message:', res);
    },
  );
};
```

## auto some routers

server

```js
const mit = require('socket-mit');
const path = require('path');
mit.load(path.resolve(__dirname, 'routers'));
mit.listen(4000);
```

```js
// routers/login.js
module.exports = {
  useEmail: function(data, ws, opts) {
    // ..
  },
  usePhone: function(data, ws, opts) {
    // ..
  },
  sendEmail: {
    changePassword: function(data, ws, opts) {
      // ..
    },
    bindEmail: {
      bindNow: function(data, ws, opts) {
        // ..
      },
      bindNextDay: function(data, ws, opts) {
        // ..
      },
    },
  },
};
```

client

```js
var ws = mit('ws://127.0.0.1:4000');
ws.onopen = function() {
  // load server routers/login.js function
  ws.dispatch('login.useEmail');
  ws.dispatch('login.sendEmail.changePassword');
  ws.dispatch('login.sendEmail.bindEmail.bindNow');
};
```

## if use mysql or other database

server:

```js
const mit = require('../serve');
const Sequelize = require('sequelize');
const { resolve } = require('path');

const sequelize = new Sequelize('test', 'root', '111Asd', { dialect: 'mysql' });
sequelize.authenticate();

// send { db: sequelize } to opts
mit.use({ db: sequelize });
mit.load(resolve(__dirname, 'routers'));
mit.listen(4000);
```

routers/hello.js

```js
module.exports = function(data, ws, opts) {
  console.log(opts); // { db: sequelize }
  // use opts.db do someting
};
```

## use local log files

set `logPath`, log save in local file, use [pino](https://github.com/pinojs/pino)

```js
const mit = require('../serve');
const path = require('path');

mit.use({ logPath: path.resolve(__dirname, 'logs') });
mit.autoLoad(path.resolve(__dirname, 'routers'));
mit.listen(4000);
```
