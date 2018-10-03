(function() {
  if (typeof WebSocket === 'undefined') {
    console.error('socket-mit: Browser no have WebSocket');
  }
  var __wsCallback = {};
  function __serral(url, options) {
    options = options || {};
    var __spaceTime = options.spaceTime === undefined ? 50 : options.spaceTime;
    var __log = options.log === undefined ? true : options.log;
    var __ws = new WebSocket(url);
    var lastTime = 0;
    __ws.dispatch = function(uri, obj, cb, focus) {
      if (typeof uri !== 'string') {
        focus = cb;
        cb = obj;
        obj = uri;
      } else {
        obj.uri = uri;
      }
      function send() {
        if (cb) {
          if (__wsCallback[obj.uri] === undefined || focus === true) {
            __wsCallback[obj.uri] = cb;
          }
        }
        if (__ws.readyState == 0) {
          __ws.onopen = function() {
            __ws.send(JSON.stringify(obj));
          };
        } else if (__ws.readyState == 1) {
          __ws.send(JSON.stringify(obj));
        } else if (__ws.readyState == 2) {
          setTimeout(() => {
            __ws = __serral(url, options);
            __ws.onopen = function() {
              __ws.send(JSON.stringify(obj));
            };
          });
        } else if (__ws.readyState == 3) {
          __ws = __serral(url, options);
          __ws.onopen = function() {
            __ws.send(JSON.stringify(obj));
          };
        } else {
          console.error('serral: socket readyState is Error');
        }
        lastTime = Date.now();
      }
      var nowTime = Date.now();
      if (nowTime - lastTime < __spaceTime) {
        setTimeout(function() {
          send();
        }, nowTime - lastTime);
      } else {
        send();
      }
    };
    __ws.onopen = function(event) {
      console.log('onopen:', event);
    };
    __ws.onerror = function(event) {
      console.warn('serral-error:', event);
    };
    __ws.onclose = function(event) {
      console.log('onclose:', event);
    };
    __ws.onmessage = function(msg) {
      var data;
      try {
        data = JSON.parse(msg.data);
      } catch (err) {
        if (__log) {
          // eslint-disable-next-line
          console.error(`serral: can't JSON.parse: ` + msg);
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
          console.warn('serral: data.uri is undifine', data);
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
