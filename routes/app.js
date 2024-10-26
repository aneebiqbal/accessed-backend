const express = require("express");
const { getLaunchpadData } = require("../controllers/app/launchpad");
const { getLessonsDrills, getDrillById } = require("../controllers/app/lessonsDrills");
const { getQuestion } = require("../controllers/app/question");
const router = express.Router();



//launchpad
router.get("/launchpad", getLaunchpadData);

//lessonsDrills
router.get("/lessons-drills", getLessonsDrills);

//getDrillById
router.get("/drill/:id", getDrillById);

//getQuestion
router.get("/getQuestion/:id", getQuestion);

module.exports = router;
