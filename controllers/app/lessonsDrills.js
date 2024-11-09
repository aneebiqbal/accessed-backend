const db = require("../../db/db");
const authMiddleware = require("../../middleware/authMiddleware");
const drillLevel = require("../../schema/drillLevel");
const {
  fetchLessonsDrills,
} = require("../../services/app/lessonsDrills.service");

const getLessonsDrills = async (req, res) => {
  try {
    await authMiddleware(req, res, async () => {
      const studentId = req.user.id;

      const { testTopics } = await fetchLessonsDrills(studentId);
      if (!testTopics.length) {
        return res
          .status(404)
          .json({ message: "No topics found for this test" });
      }

      res.status(200).json({ topics: testTopics });
    });
  } catch (error) {
    console.error("Error fetching drills:", error);
    return res.status(500).json({ error: "Failed to fetch drills data" });
  }
};

const getDrillById = async (req, res) => {
  try {
    await authMiddleware(req, res, async () => {
      const studentId = req.user.id;
      const drill_id = req.params.id;

      const student = await db.Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      if (isNaN(drill_id)) {
        return res.status(404).json({ error: "Drill not found" });
      }

      const drill = await db.Drill.findOne({
        where: { id: drill_id },
        include: [
          {
            model: db.DrillLevel,
            where: { std_id: studentId },
            required: false,
          },
          {
            model: db.DrillStatus,
            where: { student_id: studentId },
            required: false,
          },
        ],
      });

      if (!drill) {
        return res.status(404).json({ error: "Drill not found" });
      }
      if (!drill.DrillStatuses || drill.DrillStatuses.length === 0) {
        return res.status(403).json({ locked: true });
      }

      let levelZero = drill.DrillLevels.find((level) => level.levels === 0);
      if (!levelZero) {
        levelZero = await db.DrillLevel.create({
          std_id: studentId,
          drill_id: drill_id,
          levels: 0,
          status: "inProgress",
        });

        drill.DrillLevels.push(levelZero);
      } else if (levelZero.status === "Blocked") {
        await levelZero.update({ status: "inProgress" });
      }

      const totalLevels = 7;
      const levels = [];

      for (let i = 0; i < totalLevels; i++) {
        const existingLevel = drill.DrillLevels.find(
          (level) => level.levels === i
        );

        if (existingLevel) {
          levels.push({
            id: existingLevel.id,
            level: existingLevel.levels,
            status: existingLevel.status,
          });
        } else {
          levels.push({
            id: null,
            level: i,
            status: "Blocked",
          });
        }
      }

      levels.sort((a, b) => a.level - b.level);

      const allLevelsCompleted = drill.DrillLevels.every((level) => level.status === "Completed");

      let startPoint;
      let endPoint;
      let score;

      if (allLevelsCompleted) {
        startPoint = 6;
        endPoint = null;
        score = 100;
      } else {
        let foundInProgress = false;
        score = 0;

        levels.forEach((level) => {
          if (level.status === "inProgress" && !foundInProgress) {
            startPoint = level.level;
            foundInProgress = true;
          }
          if (foundInProgress && level.status === "Blocked" && endPoint == null) {
            endPoint = level.level;
          }
        });

        const inProgressLevel = drill.DrillLevels.find(
          (level) => level.status === "inProgress"
        );
        score = inProgressLevel ? inProgressLevel.score || 0 : score;
      }

      const response = {
        id: drill.id,
        title: drill.title,
        video: drill.video || "",
        drills: levels,
        score,
        startPoint,
        endPoint,
      };

      return res.json(response);
    });
  } catch (error) {
    console.error("Error fetching drill by id:", error);
    return res.status(500).json({ error: "Failed to fetch drill by id" });
  }
};


const checkDrillVideoStatus = async (req, res) => {
  try {
    await authMiddleware(req, res, async () => {
      const studentId = req.user.id;
      const drill_id = req.params.id;

      const levelZeroEntry = await db.DrillLevel.findOne({
        where: {
          drill_id: drill_id,
          std_id: studentId,
          levels: 0,
        },
      });

      if (!levelZeroEntry) {
        return res
          .status(404)
          .json({
            error: "Level 0 entry not found for the given drill and student.",
          });
      }

      if (levelZeroEntry.status === "inProgress") {
        await levelZeroEntry.update({ status: "Completed" });
      }

      const levelOneEntry = await db.DrillLevel.findOne({
        where: {
          drill_id: drill_id,
          std_id: studentId,
          levels: 1,
        },
      });

      if (!levelOneEntry) {
        await db.DrillLevel.create({
          drill_id: drill_id,
          std_id: studentId,
          levels: 1,
          status: "inProgress",
        });
        return res.json({
          message:
            "Level 0 status updated to Completed. New entry for level 1 created with status inProgress.",
        });
      } else {
        if (levelOneEntry.status === "Blocked") {
          await levelOneEntry.update({ status: "inProgress" });
          return res.json({
            message:
              "Level 0 status updated to Completed. Level 1 status changed from Blocked to inProgress.",
          });
        }
        return res.json({
          message:
            "Level 0 status updated to Completed. Level 1 entry already exists.",
        });
      }
    });
  } catch (error) {
    console.error("Error updating drill video status:", error);
    return res
      .status(500)
      .json({ error: "Failed to update drill video status" });
  }
};

module.exports = { getLessonsDrills, getDrillById, checkDrillVideoStatus };
