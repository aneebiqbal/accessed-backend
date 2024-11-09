const { resetUserPassword } = require('../../services/auth/resetPassword.service');

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.query;

    if (!newPassword) {
      return { status: 404, message: "new password is required" };
    }

    const result = await resetUserPassword(token, newPassword);

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in controller resetPassword:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};