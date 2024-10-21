const DataTypes = require("sequelize");
("use strict");
module.exports = function (sequelize) {
  var user = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        set: function(input) {
          if (input) {
              return this.setDataValue('email', input.toLowerCase());
          } else {
              return this.setDataValue('email', null);
          }
      }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      UUID: {
        type: DataTypes.CHAR(100),
        allowNull: true,
      },
    },
    {
      createdAt: 'created',
      updatedAt: 'updated',
      deletedAt: 'deleted',
      paranoid: true,
      tableName: 'users'
    },
  );
  user.associate = (models) => {
   
  };
  
  return user;
};
