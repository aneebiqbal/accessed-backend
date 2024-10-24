const { updateUserDetails } = require('../../services/auth/updateUser.service');
const authMiddleware = require("../../middleware/authMiddleware");

exports.updateUser = async (req, res) => {
  try {
    authMiddleware(req, res, async () => {
      const userId = req.user.id;
      const { first_name, last_name, number } = req.body;

      const result = await updateUserDetails(userId, first_name, last_name, number);

      return res.status(result.status).json(result);
    });
  } catch (error) {
    console.error("Error in controller updateUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};