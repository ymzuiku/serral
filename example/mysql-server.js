const mit = require('../serve');
const { resolve } = require('path');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'root', '111Asd', { dialect: 'mysql' });
sequelize.authenticate();
mit.use({ db: sequelize })

mit.load(resolve(__dirname, 'routers'));
mit.listen(4000);
