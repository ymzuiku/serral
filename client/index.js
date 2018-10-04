(function() {
  if (typeof WebSocket === 'undefined') {
    console.error('socket-mit: Browser no have WebSocket');
  }
  var wsCallback = {};
  function serral(url, options) {
    options = options || {};
    var spaceTime = options.spaceTime === undefined ? 50 : options.spaceTime;
    var autoCloseTime =
      options.autoCloseTime === undefined ? 300000 : options.autoCloseTime;
    var isLog = options.log === undefined ? true : options.log;
    var ws = new WebSocket(url);
    var lastTime = 0;
    var autoCloser = setInterval(function() {
      if (Date.now() - lastTime > autoCloseTime) {
        ws.close();
      }
    }, autoCloseTime);
    ws.dispatch = function(uri, obj, cb, focus) {
      if (typeof uri !== 'string') {
        focus = cb;
        cb = obj;
        obj = uri;
      } else {
        obj.uri = uri;
      }
      function send() {
        if (cb) {
          if (wsCallback[obj.uri] === undefined || focus === true) {
            wsCallback[obj.uri] = cb;
          }
        }
        if (ws.readyState == 0) {
          ws.onopen = function() {
            ws.send(JSON.stringify(obj));
          };
        } else if (ws.readyState == 1) {
          ws.send(JSON.stringify(obj));
        } else if (ws.readyState == 2) {
          setTimeout(() => {
            clearInterval(autoCloser);
            ws = serral(url, options);
            ws.onopen = function() {
              ws.send(JSON.stringify(obj));
            };
          });
        } else if (ws.readyState == 3) {
          clearInterval(autoCloser);
          ws = serral(url, options);
          ws.onopen = function() {
            ws.send(JSON.stringify(obj));
          };
        } else {
          console.error('serral: socket readyState is Error');
        }
        lastTime = Date.now();
      }
      var nowTime = Date.now();
      if (nowTime - lastTime < spaceTime) {
        setTimeout(function() {
          send();
        }, nowTime - lastTime);
      } else {
        send();
      }
    };
    ws.onopen = function(event) {
      console.log('onopen:', event);
    };
    ws.onerror = function(event) {
      ws.close();
      clearInterval(autoCloser);
      console.warn('serral-error:', event);
    };
    ws.onclose = function(event) {
      clearInterval(autoCloser);
      console.log('onclose:', event);
    };
    ws.onmessage = function(msg) {
      var data;
      try {
        data = JSON.parse(msg.data);
      } catch (err) {
        if (isLog) {
          // eslint-disable-next-line
          console.error(`serral: can't JSON.parse: ` + msg);
        }
      }
      if (ws.onserral) {
        ws.onserral(data, msg);
      }
      if (data && data.uri) {
        if (wsCallback[data.uri]) {
          wsCallback[data.uri](data);
          wsCallback[data.uri] = undefined;
        }
      } else {
        // eslint-disable-next-line
        if (isLog) {
          console.warn('serral: data.uri is undifine', data);
        }
      }
    };
    return ws;
  }
  window.__serral = serral;
  if (typeof module !== 'undefined') {
    module.exports = serral;
  }
})();
