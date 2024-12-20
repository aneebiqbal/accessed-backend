const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrillLevel = sequelize.define('DrillLevel', {
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
    std_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Students',
        key: 'id',
      },
    },
    time: {
      type: DataTypes.STRING,
    },
    isTime: {
      type: DataTypes.BOOLEAN,
    },
    levels: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM('Completed', 'inProgress', 'Blocked'),
      defaultValue: 'Blocked',
    },
    score: {
      type: DataTypes.FLOAT,
    },
  });
  
  DrillLevel.associate = (models) => {
    DrillLevel.belongsTo(models.Drill, { foreignKey: 'drill_id' });
    DrillLevel.belongsTo(models.Student, { foreignKey: 'std_id' });
  };


  return DrillLevel;
};