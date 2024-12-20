
const { where } = require("sequelize");
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
                  attributes: ['id', 'levels', 'status'],
                  where: {std_id: studentId},
                  required: false,
                },
                {
                  model: db.DrillStatus,
                  attributes: ['status', 'id'],
                  where: {
                    student_id: studentId,
                  },
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    const formattedTopics = testTopics.map((topic) => ({
      id: topic.Topic?.id,
      title: topic.Topic?.title,
      drills: Array.isArray(topic.Topic.Drills)
        ? topic.Topic.Drills.reduce((drillsAcc, drill) => {
          const drillStatus = drill.DrillStatuses.length > 0 ? drill.DrillStatuses[0].status : 'Blocked';

          const inProgressLevel = drill.DrillLevels.find(
            (level) => level.status === "inProgress"
          );
        
          const currentLevel = drillStatus === "Completed" 
            ? 6 
            : inProgressLevel
              ? inProgressLevel.levels
              : 0; 

            drillsAcc[drill.title.replace(/\s+/g, '')] = {
              id: drill.id,
              title: drill.title,
              video: drill.video || '',
              status: drill.DrillStatuses.length
                ? drill.DrillStatuses[0].status
                : 'Blocked',
              level: currentLevel,
            
            };
            return drillsAcc;
          }, {})
        : {},
    }));


    return { testTopics: formattedTopics };

  } catch (error) {
    console.error('Error in fetching Lessons and drills:', error);
    throw new Error('Failed to fetch Lessons and drills');
  }
};


module.exports = { fetchLessonsDrills };
