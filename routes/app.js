const express = require("express");
const { launchPad } = require("../controllers/app/launchpad");
const router = express.Router();



//launchpad
router.get("/launchpad", launchPad);


module.exports = router;
