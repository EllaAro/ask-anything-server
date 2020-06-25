const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const UserModel = require("./user");
const PostModel = require("./post");
const CommentModel = require("./comment");
const likeModel = require("./like");

const sequelize = new Sequelize("ask-anything", "postgres", "ellaaronov", {
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const User = UserModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);
const Comment = CommentModel(sequelize, Sequelize);
const Like = likeModel(sequelize, Sequelize);

Post.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});

Post.hasMany(Comment);

User.hasMany(Post);

User.hasMany(Comment);

User.hasMany(Like);

Post.hasMany(Like);

module.exports = {
  User,
  Post,
  Comment,
  Like,
  sequelize,
  Op,
};
