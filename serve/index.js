// const uws = require('uws');
const http = require('http');
const fp = require('./fp');
const pino = require('pino');
const os = require('os');
const server = http.createServer();

let options = {
  lib: 'uws',
  isDev: os.platform() === 'win32' || os.platform() === 'darwin' ? true : false,
  log: {
    info: function() {},
    error: function() {},
    warn: function() {},
    once: function() {},
    fatal: function() {},
    level: function() {},
    debug: function() {},
    trace: function() {},
    off: function() {},
    on: function() {},
    level: function() {},
    levels: function() {},
    emit: function() {},
  },
  isLog: true,
  logPath: undefined,
};

function use(opts = options) {
  options = { ...options, ...opts };
}

function load(routerPath, opts = options) {
  opts = { ...options, ...opts };
  const WS = require(opts.lib)
  const ws = new WS.Server({
    server,
  });
  const today = new Date();
  const now = `-${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`;
  if (opts.logPath) {
    opts.log = pino(pino.destination(opts.logPath + now));
  } else {
    opts.log = pino({
      prettyPrint: {
        levelFirst: true,
      },
      prettifier: require('pino-pretty'),
    });
  }
  const socketFns = fp.flattenToMap(fp.loadDir(routerPath));
  console.log('mit-functions:', socketFns);
  ws.on('connection', socket => {
    socket.on('message', msg => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch (err) {
        console.error('mit: msg no json ', msg);
      }
      socket.dispatch = function(obj) {
        obj.uri = data.uri;
        socket.send(JSON.stringify(obj));
      };
      if (data && data.uri && socketFns[data.uri]) {
        if (opts.isLog) {
          opts.log.info(data);
        }
        socketFns[data.uri](data, socket, opts);
      } else {
        console.log('mit: no have socket router in', msg);
      }
    });
  });
}
function listen(port) {
  console.log('mit-listen: ws://127.0.0.1:' + port);
  server.listen(port);
}

module.exports = {
  use,
  load,
  listen,
  options: options,
};
