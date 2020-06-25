module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("like", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  });

  return Like;
};
