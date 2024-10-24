const { loginUser } = require('../../services/auth/login.service');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in controller login:", error);
    res.status(500).json({ status: "error", error: "Authentication failed" });
  }
};
