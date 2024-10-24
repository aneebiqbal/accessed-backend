const { changeUserTest } = require('../../services/auth/changeTest.service');
const authMiddleware = require("../../middleware/authMiddleware");

exports.changeTest = async (req, res) => {
  try {
    authMiddleware(req, res, async () => {
      const userId = req.user.id;
      const { test_id } = req.body;

      const result = await changeUserTest(userId, test_id);

      return res.status(result.status).json(result);
    });
  } catch (error) {
    console.error("Error in controller changeTest:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
