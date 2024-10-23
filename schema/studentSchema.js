const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    number: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    test_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tests',
        key: 'id',
      },
    },
  });

  Student.associate = (models) => {
    Student.belongsTo(models.Test, { foreignKey: 'test_id' });
    Student.hasMany(models.DrillLevel, { foreignKey: 'std_id' });
    Student.hasMany(models.DrillStatuses, { foreignKey: 'student_id' });
    Student.hasMany(models.QuestionStatuses, { foreignKey: 'student_id' });
  };

  return Student;
};