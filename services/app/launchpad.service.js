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

    const topics = await Promise.all(
      (await db.Topic.findAll({
        include: [{
          model: db.TestTopic,
          where: { test_id: testInfo.id },
        }],
        attributes: ['title', 'description', 'id'],
      })).map(async (topic) => {
        
        if (!topic.id) {
          throw new Error(`Topic ID is undefined for topic: ${topic.title}`);
        }
    
        const allDrills = await db.Drill.findAll({
          where: { topic_id: topic?.id },
          attributes: ['title', 'id'],
        });
    
        const drillLevels = await db.DrillLevel.findAll({
          where: { std_id: userId },
          attributes: ['score', 'drill_id'],
        });
    
        const drillScoreMap = new Map(
          drillLevels.map((level) => [level.drill_id, level.score])
        );
    
        const allDrillsCompleted = allDrills.every((drill) => {
          const score = drillScoreMap.get(drill.id);
          return score !== undefined && score === 100;
        });
    
        const topicStatus = allDrills.length === 1
          ? (drillScoreMap.get(allDrills[0].id) === 100 ? 'completed' : 'inprogress')
          : (allDrillsCompleted ? 'completed' : 'inprogress');
    
        return {
          id: topic.id,
          title: topic.title,
          description: topic.description,
          status: topicStatus,
        };
      })
    );
    

    const graphData = await Promise.all(
      topics.map(async (topic) => {
        const allDrills = await db.Drill.findAll({
          where: { topic_id: topic.id },
          attributes: ['title', 'id'],
        });
    
        const drillLevels = await db.DrillLevel.findAll({
          where: { std_id: userId },
          attributes: ['score', 'drill_id', 'levels'],
        });
    
        const drillScoreMap = new Map();
    
        drillLevels.forEach((level) => {
          const currentScore = drillScoreMap.get(level.drill_id) || 0;
          drillScoreMap.set(level.drill_id, currentScore + level.score);
        });
    
        const drillData = allDrills.map((drill) => {
          const totalScore = drillScoreMap.get(drill.id) || 0;
          const drillScorePercentage = (totalScore / 600) * 100;
          return {
            title: drill.title,
            score: parseFloat(drillScorePercentage.toFixed(2)),
            total: 100
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
