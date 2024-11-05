const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Enrollments = sequelize.define("Enrollments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  });

  return Enrollments;
};
