const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Test = sequelize.define('Test', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    est_hours: {
      type: DataTypes.FLOAT,
    },
    no_lessons: {
      type: DataTypes.INTEGER,
    },
  });
  
  Test.associate = (models) => {
    Test.hasMany(models.Student, { foreignKey: 'test_id', as: 'Student' });
    Test.hasMany(models.TestTopic, { foreignKey: 'test_id', as: 'testTopic' });
  };

  return Test;
};