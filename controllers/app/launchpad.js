const authMiddleware = require('../../middleware/authMiddleware');
const { fetchLaunchpadData } = require('../../services/app/launchpad.service');

const getLaunchpadData = async (req, res) => {
  try {
    await authMiddleware(req, res, async () => {
      const userId = req.user.id;

      const { testInfo, topics, graphData } = await fetchLaunchpadData(userId);

      const response = {
        testInfo: {
          title: testInfo.title,
          description: testInfo.description,
          lessons: testInfo.no_lessons,
          hours: testInfo.est_hours,
        },
        topics: topics.map((topic) => ({
          title: topic.title,
          description: topic.description,
          status: topic.status,
        })),
        graphData: graphData.map((topicData) => ({
          subject: topicData.title,
          score: topicData.totalScore,
          drills: topicData.drills.map((drill) => ({
            title: drill.title,
            score: drill.score,
            total: 100, 
          })),
        })),

      };

      return res.status(200).json(response);
    });
  } catch (error) {
    console.error('Error fetching launchpad data:', error);
    return res.status(500).json({ error: 'Failed to fetch launchpad data' });
  }
};


module.exports = { getLaunchpadData };
