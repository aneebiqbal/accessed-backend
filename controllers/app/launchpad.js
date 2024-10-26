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
        })),
        //dummy graph data
        graphData: [
          {
            subject: "English",
            score: 65,
            drills: [
              {
                title: "Synonyms",
                score: 15,
                total: 33,
              },
            ]
          },
          { subject: "General knowledge", score: 75 },
          { subject: "Intelligence", score: 70 },
          { subject: "Reasoning", score: 60 },
          { subject: "Mathematics", score: 55 },
        ]

        //use below with real data
        // graphdata: graphData.map((drill) => ({
        //   subject: drill.title,
        //   score: drill.DrillLevels.reduce((acc, level) => acc + level.score, 0),
        //   drills: drill.DrillLevels.map((level) => ({
        //     title: drill.title,
        //     score: level.score,
        //     total: level.QuestionStatuses.length,
        //   })),
        // })),
      };
  
      return res.status(200).json(response);
    })
  } catch (error) {
    console.error('Error fetching launchpad data:', error);
    return res.status(500).json({ error: 'Failed to fetch launchpad data' });
  }
};

module.exports = { getLaunchpadData };
