const db = require('../db/db');

const fetchLaunchpadData = async (userId) => {
  try {

    const student = await db.Student.findOne({
    where: { id: userId },
      attributes: ['test_id'], 
    })

    if (!student) {
        throw new Error('Student not found');
      }
  
    const testInfo = await db.Test.findOne({
      where: { id: student.test_id },
    });

    const topics = await db.Topic.findAll({
      include: [{
        model: db.TestTopic,
        where: { test_id: testInfo.id },
      }],
      attributes: ['title', 'description'],
    });
  
    //use below func() for real-data
    // const graphData = await db.Drill.findAll({
    //   include: [{
    //     model: db.DrillLevel,
    //     attributes: ['score'],
    //     include: {
    //       model: db.QuestionStatus,
    //       attributes: ['score'],
    //     },
    //   }],
    //   attributes: ['title'],
    // });

    // return { testInfo, topics, graphData };
    return { testInfo, topics };

  } catch (error) {
    console.error('Error in fetching launchpad data:', error);
    throw new Error('Failed to fetch launchpad data');
  }
};

module.exports = { fetchLaunchpadData };
