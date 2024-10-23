const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionType: {
        type: DataTypes.ENUM('image', 'passage', 'MCQs'),
        allowNull: false,
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
  
  Question.associate = (models) => {
    Question.belongsTo(models.Drill, { foreignKey: 'drill_id' });
    Question.hasMany(models.QuestionStatus, { foreignKey: 'question_id' });
  };
  return Question;
};