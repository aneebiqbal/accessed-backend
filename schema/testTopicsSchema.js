const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TestTopic = sequelize.define('TestTopic', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    test_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tests',
        key: 'id',
      },
    },
    topic_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Topics',
        key: 'id',
      },
    },
  });

  TestTopic.associate = (models) => {
    TestTopic.belongsTo(models.Test, {
      foreignKey: 'test_id'
    });
    
    TestTopic.belongsTo(models.Topic, {
      foreignKey: 'topic_id'
    });
  };

  return TestTopic;
};