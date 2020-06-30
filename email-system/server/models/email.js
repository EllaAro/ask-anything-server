module.exports = (sequelize, Sequelize) => {
  const Email = sequelize.define("email", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    receiver: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Email;
};
