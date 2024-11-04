const express = require("express");
const { getLaunchpadData } = require("../controllers/app/launchpad");
const { getLessonsDrills, getDrillById, checkDrillVideoStatus } = require("../controllers/app/lessonsDrills");
const { getQuestion, submitQuestion } = require("../controllers/app/question");
const router = express.Router();



//launchpad
router.get("/launchpad", getLaunchpadData);

//lessonsDrills
router.get("/lessons-drills", getLessonsDrills);

//check-Drill-VideoStatus
router.get("/lessons-drills/video/:id", checkDrillVideoStatus);

//getDrillById
router.get("/drill/:id", getDrillById);

//getQuestion
router.get("/getQuestion/:id", getQuestion);

//submitQuestion
router.post("/submitQuestion", submitQuestion);


module.exports = router;
