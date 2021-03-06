# Use [uWebSockets](https://github.com/uNetworking/uWebSockets) like http-server in Nodejs

- Very tiny, only use [uWebSocket](https://github.com/uNetworking/uWebSockets) do Micro Service;
- Client use `ws.fetch(uri)` call server router files;
- Easy extends options in router;
- Use very fast Log system, use [pino](http://getpino.io/#/);
- Auto reconnet WebSocket;
- Long time auto close WebSocket;
- Like Serral in StarCraft2, simple and direct powerful.

## Look Demo

This way is easy run example, just copy this code in your Terminal:

```
git clone -b master --single-branch https://github.com/ymzuiku/serral
cd serral
yarn install && clear
node example/serve.js & sleep 0.5 && open example/client.html
```
Waiting `git clone` and `npm install` , if server runing, look Terminal and Browser like this:

![](.imgs/2018-10-02-23-10-37.png)

The Web is at 30ms emit socket server;

## Install

```
$ npm i --save serral
# or
$ yarn add -D serral
```

## Get Started

You can look example/serve.js and example/client.html

### In client:

If you use React or Vue, add code in `src/index.js`

```js
import serralClient from 'serral/client';
const ws = serralClient('ws://127.0.0.1:4000');
ws.onopen = function() {
  ws.fetch(
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

### In server:

server/index.js

```js
const serral = require('serral');
const path = require('path');

// auto load routers/xxx.js and router/xxx/index.js;
// ignore underline begins files, like: _xxx.js
serral.load(path.resolve(__dirname, 'routers'));
serral.listen(4000);
```

server/routers/hello.js

```js
module.exports = function(data, ws) {
  console.log(data);
  // if set uri, client can run wsCallback[uri] function
  ws.json({ uri:data.uri, name: 'server:hello-client', age: 100 });
};
```

Run serve:

```sh
node server/index.js
```

## Load routers  rule:

Use `serral.load('dir-path')`, serral can auto load files in directory:
- If file return a `function`, serral use the file name like router path.
- If file return a `{ obj }`, serral use file.objName.objName... until obj is function
- If the 'file' is Directory, serral use require(file/index.js)
- Ignore underline begins files, like: _xxx.js

This's example:

Server

server/index.js

```js
const serral = require('serral');
const path = require('path');
serral.load(path.resolve(__dirname, 'routers'));
serral.listen(4000);
```
server/routers/login.js

```js
module.exports = {
  // In client: ws.fetch('login.useEmail');
  useEmail: function(data, ws, opts) {
    // ws.json({ uri:data.uri, ...})
  },
  sendEmail: {
    // In client: ws.fetch('login.sendEmail.changePassword');
    changePassword: function(data, ws, opts) {
      // ws.json({ uri:data.uri, ...})
    },
    bindEmail: {
      // In client: ws.fetch('login.sendEmail.bindEmail.bindNow');
      bindNow: function(data, ws, opts) {
        // ws.json({ uri:data.uri, ...})
      },
    },
  },
};
```

Client

```js
import serralClient from 'serral/client';
const ws = serralClient('ws://127.0.0.1:4000');
ws.onopen = function() {
  // load server routers/login.js function
  ws.fetch('login.useEmail');
  ws.fetch('login.sendEmail.changePassword');
  ws.fetch('login.sendEmail.bindEmail.bindNow');
};
```

## Extends: If use mysql or other package

Server:

server/index.js

```js
const serral = require('../serve');
const Sequelize = require('sequelize');
const { resolve } = require('path');

const sequelize = new Sequelize('test', 'root', '111Asd', { dialect: 'mysql' });
sequelize.authenticate();

// Extends { db: sequelize } to opts
serral.use({ db: sequelize });
// serral.use() need before serral.load()
serral.load(resolve(__dirname, 'routers'));
serral.listen(4000);
```

server/routers/hello.js

```js
// sequelize is extends in opts
module.exports = function(data, ws, opts) {
  console.log(opts); // { db: sequelize }
  // use opts.db do someting
};
```

## Use local log files

If you set `logPath`, log save in local file, use [pino](https://github.com/pinojs/pino)

```js
const serral = require('../serve');
const path = require('path');

// need ensure the existence of logPath
serral.use({ logPath: path.resolve(__dirname, 'logs') });
// serral.use() need before serral.load()
serral.load(path.resolve(__dirname, 'routers'));
serral.listen(4000);
```

## Use WebSocket replace to uWebSockets

serral default use uWebSockets, but it's remove in npm.org. serral keep use uws@10.148.1. if you need use WebSocket replace to uWebSockets, you can use `lib: 'ws'` :

```js
const serral = require('../serve');
const path = require('path');
serral.use({ lib: 'ws' });
serral.load(path.resolve(__dirname, 'routers'));
serral.listen(4000);
```

## API setting live

![](.imgs/2018-10-02-22-47-35.png)


## Licenes

```
MIT License

Copyright (c) 2013-present, Facebook, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
