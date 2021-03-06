const http = require('http');
const fp = require('./fp');
const pino = require('pino');
const os = require('os');
const server = http.createServer();

let options = {
  lib: '../uws/uws.js',
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
  const WS = require(opts.lib);
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
  opts.log.info('mit-functions:', socketFns);
  ws.on('connection', socket => {
    socket.json = function(obj) {
      socket.send(JSON.stringify(obj));
    };
    socket.on('message', msg => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch (err) {
        opts.log.warn('serral: msg no json ', msg);
        socket.send(JSON.stringify({ error: 'msg no json', clientMsg: msg }));
        return;
      }
      if (data && data.uri) {
        if (socketFns[data.uri]) {
          if (opts.isLog) {
            opts.log.info(data);
          }
          socketFns[data.uri](data, socket, opts);
        } else {
          opts.log.warn('serral: uri is undifine', msg);
          socket.json({ error: 'serral: uri is undifine', clientMsg: msg });
        }
      } else {
        opts.log.warn('serral: no have socket router in', msg);
        socket.send(
          JSON.stringify({ error: 'serral: no have socket router in', msg }),
        );
      }
    });
  });
}
function listen(port) {
  console.log('serral-listen: ws://127.0.0.1:' + port);
  server.listen(port);
}

module.exports = {
  use,
  load,
  listen,
  options: options,
};
