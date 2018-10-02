const serral = require('../serve');
const { resolve } = require('path');

serral.load(resolve(__dirname, 'routers'));
serral.listen(4000);
