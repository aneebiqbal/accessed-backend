const express = require("express");
const { getLaunchpadData } = require("../controllers/app/launchpad");
const { getLessonsDrills } = require("../controllers/app/lessonsDrills");
const router = express.Router();



//launchpad
router.get("/launchpad", getLaunchpadData);

//lessonsDrills
router.get("/lessons-drills", getLessonsDrills);

module.exports = router;
