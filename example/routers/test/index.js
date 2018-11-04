module.exports = function(data, ws, opts) {
  console.log(data);
  console.log('im test');
  ws.json({ uri:data.uri, name: 'server:hello-client', test: 100 });
};
