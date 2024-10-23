const db = require('../../db/db');
const authMiddleware = require('../../middleware/authMiddleware');
const { fetchLessonsDrills } = require('../../services/lessonsDrills.service');

const getLessonsDrills = async (req, res) => {
  try {
    await authMiddleware(req, res, async () => {
      const studentId = req.user.id;

      const { testTopics } = await fetchLessonsDrills(studentId);
      if (!testTopics.length) {
        return res.status(404).json({ message: 'No topics found for this test' });
      }
  
      const formattedResponse = testTopics.map((topic) => ({
        id: topic.Topic.id,
        title: topic.Topic.title,
        drills: Array.isArray(topic.Topic.Drills) ? topic.Topic.Drills.reduce((drillsAcc, drill) => {
          drillsAcc[drill.title.toLowerCase()] = {
            id: drill.id,
            title: drill.title,
            video: drill.video || '',
            status: drill.DrillStatuses.length
              ? drill.DrillStatuses[0].status
              : 'notStarted',
            level: drill.DrillLevels.length ? drill.DrillLevels[0].levels : null,
          };
          return drillsAcc;
        }, {}) : {},
      }));
  
      res.status(200).json({ topics: formattedResponse });

    })
  } catch (error) {
    console.error('Error fetching launchpad data:', error);
    return res.status(500).json({ error: 'Failed to fetch launchpad data' });
  }
};

module.exports = { getLessonsDrills };

