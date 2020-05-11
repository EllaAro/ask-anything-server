const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('ask-anything','root','ellaaronov',{
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;