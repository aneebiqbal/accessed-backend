const { sendPasswordResetLink } = require('../../services/auth/forgetPassword.service');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await sendPasswordResetLink(email);

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in controller forgotPassword:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
