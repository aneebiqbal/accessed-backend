const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrillStatus = sequelize.define('DrillStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    drill_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Drills',
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
    status: {
        type: DataTypes.ENUM('Completed', 'inProgress', 'Blocked'),
        defaultValue: 'Blocked',
      },
  });

  DrillStatus.associate = (models) => {
    DrillStatus.belongsTo(models.Drill, { foreignKey: 'drill_id' });
    DrillStatus.belongsTo(models.Student, { foreignKey: 'student_id' });
  };
  return DrillStatus;
};