const db = require("../../db/db");


const fetchLaunchpadData = async (userId) => {
  try {
    const student = await db.Student.findOne({
      where: { id: userId },
      attributes: ['test_id'], 
    });

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
      attributes: ['title', 'description', 'id'],
    });

    const graphData = await Promise.all(
      topics.map(async (topic) => {
        const drills = await db.Drill.findAll({
          where: { topic_id: topic.id },
          include: [
            {
              model: db.DrillLevel,
              attributes: ['score'],
            },
          ],
        });

        const drillData = drills.map((drill) => {
          const totalScoreForDrill = drill.DrillLevels.reduce(
            (totalScore, level) => totalScore + level.score,
            0
          );

          const score = (totalScoreForDrill / 600) * 100;

          return {
            title: drill.title,
            score: parseFloat(score.toFixed(2)), 
          };
        });

        const totalScore = drillData.length
          ? drillData.reduce((topicScore, drill) => topicScore + drill.score, 0) / drillData.length
          : 0;

        return {
          title: topic.title,
          totalScore: parseFloat(totalScore.toFixed(2)),
          drills: drillData,
        };
      })
    );

    return { testInfo, topics, graphData };

  } catch (error) {
    console.error('Error in fetching launchpad data:', error);
    throw new Error('Failed to fetch launchpad data');
  }
};

module.exports = { fetchLaunchpadData };

