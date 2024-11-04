const { Sequelize } = require('sequelize');
const drillSchema = require('../schema/drillSchema');
const drillStatus = require('../schema/drillStatus');
const drillLevel = require('../schema/drillLevel');
const questionsSchema = require('../schema/questionsSchema');
const questionStatusSchema = require('../schema/questionStatusSchema');
const studentSchema = require('../schema/studentSchema');
const testSchema = require('../schema/testSchema');
const testTopicsSchema = require('../schema/testTopicsSchema');
const topicsSchema = require('../schema/topicSchema');
const enrollmentsSchema = require('../schema/enrollments');

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

const Student = studentSchema(sequelize);
const Drill = drillSchema(sequelize);
const DrillStatus = drillStatus(sequelize);
const DrillLevel = drillLevel(sequelize);
const Question = questionsSchema(sequelize);
const QuestionStatus = questionStatusSchema(sequelize);
const Test = testSchema(sequelize);
const TestTopic = testTopicsSchema(sequelize);
const Topic = topicsSchema(sequelize);
const enrollments = enrollmentsSchema(sequelize);


const db = {
  Drill,
  DrillStatus,
  DrillLevel,
  Question,
  QuestionStatus,
  Student,
  Test,
  TestTopic,
  Topic,
  enrollments
};

// =>this below function is used to run the assosiations
// for (const modelName in sequelize.models) {
//   if (sequelize.models[modelName].associate) {
//     sequelize.models[modelName].associate(sequelize.models);
//   }
// }

db.Student.associate(db);
db.Drill.associate(db);
db.DrillStatus.associate(db);
db.DrillLevel.associate(db);
db.Question.associate(db);
db.QuestionStatus.associate(db);
db.Test.associate(db);
db.TestTopic.associate(db);
db.Topic.associate(db);

sequelize.sync();

// Use Sequelize's `sync` method with { force: true } to drop and recreate tables
// sequelize.sync({ force: true })
//   .then(() => {
//     console.log('Tables dropped and recreated successfully.');
//   })
//   .catch((error) => {
//     console.error('Error dropping and recreating tables:', error);
//   });

module.exports = db;