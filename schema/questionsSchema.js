const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    passage: {
      type: DataTypes.TEXT,
    },
    statement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    options: {
      type: DataTypes.JSON,
    },
    correct_answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drill_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Drills',
        key: 'id',
      },
    },
  });

  return Question;
};