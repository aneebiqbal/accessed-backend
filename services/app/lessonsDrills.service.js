
const db = require("../../db/db");

const fetchLessonsDrills = async (studentId) => {
  try {

    const student = await db.Student.findOne({
        where: { id: studentId },
        include: [{ model: db.Test }],
      });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const testTopics = await db.TestTopic.findAll({
        where: { test_id: student.test_id },
        include: [
          {
            model: db.Topic,
            include: [
              {
                model: db.Drill,
                include: [
                  {
                    model: db.DrillLevel,
                    attributes: ['id', 'levels'],
                  },
                  {
                    model: db.DrillStatus,
                    attributes: ['status'],
                  },
                ],
              },
            ],
          },
        ],
      });

    return { testTopics };

  } catch (error) {
    console.error('Error in fetching launchpad data:', error);
    throw new Error('Failed to fetch launchpad data');
  }
};

module.exports = { fetchLessonsDrills };
