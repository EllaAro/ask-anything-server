const Sequelize = require('sequelize');
const UserModel = require('../models/user');
const PostModel = require('../models/post');

const sequelize = new Sequelize('ask-anything','postgres','ellaaronov',{
    host: 'localhost',
    dialect: 'postgres', 
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

const User = UserModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);

module.exports = {
  User,
  Post,
  sequelize,
}