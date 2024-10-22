const authMiddleware = require("../../middleware/authMiddleware");

exports.launchPad = (req, res) => {
  try {
    
      res.status(200).json({ message: "hi to launchpad" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
