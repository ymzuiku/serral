(function() {
  if (typeof WebSocket === 'undefined') {
    console.error('socket-mit: Browser no have WebSocket');
  }
  function __serral(url, options) {
    options = options || {};
    var __spaceTime = options.spaceTime === undefined ? 50 : options.spaceTime;
    var __log = options.log === undefined ? true : options.log;
    var __ws = new WebSocket(url);
    var __wsCallback = {};
    var lastTime = 0;
    __ws.dispatch = function(uri, obj, cb, focus) {
      function send() {
        if (typeof uri !== 'string') {
          focus = cb;
          cb = obj;
          obj = uri;
        } else {
          obj.uri = uri;
        }
        if (cb) {
          if (__wsCallback[obj.uri] === undefined || focus === true) {
            __wsCallback[obj.uri] = cb;
          }
        }
        __ws.send(JSON.stringify(obj));
        lastTime = Date.now();
      }
      var nowTime = Date.now();
      if (nowTime - lastTime < __spaceTime) {
        setTimeout(function() {
          send();
        }, 50);
      } else {
        send();
      }
    };
    __ws.onmessage = function(msg) {
      var data;
      try {
        data = JSON.parse(msg.data);
      } catch (err) {
        if (__log) {
          // eslint-disable-next-line
          console.error(`mit: can't JSON.parse: ` + msg);
        }
      }
      if (data && data.uri) {
        if (__wsCallback[data.uri]) {
          __wsCallback[data.uri](data);
          __wsCallback[data.uri] = undefined;
        }
      } else {
        // eslint-disable-next-line
        if (__log) {
          console.warn('mit: data.url is undifine', data);
        }
      }
    };
    return __ws;
  }
  window.__serral = __serral;
  if (typeof module !== 'undefined') {
    module.exports = __serral;
  }
})();
