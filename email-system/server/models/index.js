const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const UserModel = require("./user");
const EmailModel = require("./email");

const sequelize = new Sequelize("email-system", "postgres", "ellaaronov", {
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
const Email = EmailModel(sequelize, Sequelize);

Email.hasOne(User);

module.exports = {
  User,
  Email,
  sequelize,
  Op,
};
