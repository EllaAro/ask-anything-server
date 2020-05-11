const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Post = sequelize.define('post',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title:{ 
        type: Sequelize.STRING,
        allowNull: false,
    },
    content:{ 
        type: Sequelize.STRING,
        allowNull: false,
    },
    // tags:{
    //     type: Sequelize.ARRAY,
    //     allowNull: false,
    // }

});

module.export = Post;