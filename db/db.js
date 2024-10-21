const { Sequelize } = require('sequelize');
const UserModel = require('../schema/userSchema');


const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },

});

const User = UserModel(sequelize);


sequelize.sync();

// Use Sequelize's `sync` method with { force: true } to drop and recreate tables
// sequelize.sync({ force: true })
//   .then(() => {
//     console.log('Tables dropped and recreated successfully.');
//   })
//   .catch((error) => {
//     console.error('Error dropping and recreating tables:', error);
//   });

module.exports = {
  User,
};