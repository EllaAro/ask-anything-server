const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('ask-anything','postgres','ellaaronov',{
    host: 'localhost',
    dialect: 'postgres', 
    
});

module.exports = sequelize;