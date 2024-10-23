const express = require("express");
const { getLaunchpadData } = require("../controllers/app/launchpad");
const router = express.Router();



//launchpad
router.get("/launchpad", getLaunchpadData);


module.exports = router;
