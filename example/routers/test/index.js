module.exports = function(data, ws, opts) {
  console.log(data);
  console.log('im test');
  ws.dispatch({ name: 'server:hello-client', test: 100 });
};
