const mit = require('../serve');
const { resolve } = require('path');

mit.load(resolve(__dirname, 'routers'));
mit.listen(4000);
