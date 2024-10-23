const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Drill = sequelize.define('Drill', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video: {
      type: DataTypes.STRING,
    },
    topic_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Topics',
        key: 'id',
      },
    },
  });

  Drill.associate = (models) => {
    Drill.belongsTo(models.Topic, { foreignKey: 'topic_id' });
    Drill.hasMany(models.DrillLevel, { foreignKey: 'drill_id' });
    Drill.hasMany(models.Question, { foreignKey: 'drill_id' });
    Drill.hasMany(models.DrillStatuses, { foreignKey: 'drill_id' });
  };

  return Drill;
};