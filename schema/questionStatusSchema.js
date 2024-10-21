const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QuestionStatus = sequelize.define('QuestionStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Questions',
        key: 'id',
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Students',
        key: 'id',
      },
    },
    attempted_answer: {
      type: DataTypes.STRING,
    },
  });

  return QuestionStatus;
};