const { changeUserPassword } = require('../../services/auth/changePassword.service');
const authMiddleware = require("../../middleware/authMiddleware");

exports.changePassword = async (req, res) => {
  try {
    authMiddleware(req, res, async () => {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const userId = req.user.id;

      const result = await changeUserPassword(userId, oldPassword, newPassword, confirmPassword);

      return res.status(result.status).json(result);
    });
  } catch (error) {
    console.error("Error in controller changePassword:", error);
    return res
      .status(500)
      .json({ error: "Password change failed", details: error.message });
  }
};
