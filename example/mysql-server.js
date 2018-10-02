const serral = require('../serve');
const { resolve } = require('path');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'root', '111Asd', { dialect: 'mysql' });
sequelize.authenticate();
serral.use({ db: sequelize })

serral.load(resolve(__dirname, 'routers'));
serral.listen(4000);
