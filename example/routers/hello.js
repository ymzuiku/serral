module.exports = function(data, ws, opts) {
  console.log(data);
  ws.dispatch({ name: 'server:hello-client', age: 100 });
};
