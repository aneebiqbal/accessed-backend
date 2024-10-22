const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Topic = sequelize.define('Topic', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  return Topic;
};