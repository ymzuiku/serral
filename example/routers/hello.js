module.exports = function(data, ws, opts) {
  console.log(data);
  ws.json({ uri:data.uri, name: 'server:hello-client', age: 100 });
};
