const db = require('../../db/db');
const authMiddleware = require('../../middleware/authMiddleware');
const { fetchLessonsDrills } = require('../../services/app/lessonsDrills.service');

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
          drillsAcc[drill.title.replace(/\s+/g, '')] = {
            id: drill.id,
            title: drill.title,
            video: drill.video || '',
            status: drill.DrillStatuses.length
              ? drill.DrillStatuses[0].status
              : 'blocked',
            level: drill.DrillLevels.length ? drill.DrillLevels[0].levels : null,
          };
          return drillsAcc;
        }, {}) : {},
      }));

      res.status(200).json({ topics: formattedResponse });

    })
  } catch (error) {
    console.error('Error fetching drills:', error);
    return res.status(500).json({ error: 'Failed to fetch drills data' });
  }
};

const getDrillById = async (req, res) => {
  try {
    await authMiddleware(req, res, async () => {
      const studentId = req.user.id;
      const drill_id = req.params.id

      const student = await db.Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const drill = await db.Drill.findOne({
        where: { id: drill_id },
        include: [
          {
            model: db.DrillLevel,
            where: { std_id: studentId },
            required: false
          },
          {
            model: db.DrillStatus,
            where: { student_id: studentId },
            required: false
          }
        ]
      });

      if (!drill) {
        return res.status(404).json({ error: 'Drill not found' });
      }
      let isAccessible = drill.DrillStatuses.some(status => status.status !== 'Blocked');

      if (!isAccessible) {
        return res.json({
          success: true,
          message: 'Drill is blocked and cannot be accessed.',
          result: []
        });
      }

      const levelZeroExists = drill.DrillLevels.some(level => level.levels === 0);

      if (!levelZeroExists) {
        const newLevel = await db.DrillLevel.create({
          levels: 0,
          drill_id: drill_id,
          std_id: studentId,
          status: 'inProgress'
        });

        drill.DrillLevels.push(newLevel);
      }

      

      let levels = drill.DrillLevels.map(level => ({
        id: level.id,
        level: level.levels,
        status: level.status || 'Blocked',
      }));

      const totalLevels = 6;
      for (let i = levels.length; i < totalLevels; i++) {
        levels.push({
          id: null,
          level: levels.length + 1,
          status: 'Blocked'
        });
      }

      levels.sort((a, b) => a.level - b.level);

      let startPoint = null;
      let endPoint = null;
      let foundInProgress = false;

      levels.forEach((level) => {
        if (level.status === 'inProgress') {
          startPoint = level.level;
          foundInProgress = true;
        }

        if (foundInProgress && level.status === 'Blocked' && !endPoint) {
          endPoint = level.level;
        }
      });

      if (startPoint === 6) {
        endPoint = null;
      }

      const response = {
        id: drill.id,
        title: drill.title,
        video: drill.video || '',
        drills: levels.slice(0, totalLevels),
        score: drill.DrillLevels.reduce((acc, level) => acc + (level.score || 0), 0),
        startPoint,
        endPoint,
      };

      return res.json(response);

    })
  } catch (error) {
    console.error('Error fetching drills by id:', error);
    return res.status(500).json({ error: 'Failed to fetch drills by id' });
  }
};


module.exports = { getLessonsDrills, getDrillById };

