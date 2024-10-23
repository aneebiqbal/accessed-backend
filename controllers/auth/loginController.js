const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Student: User } = require("../../db/db");

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email.toLowerCase() } });

    if (!user) {
      return res.status(400).json({ status: "error", error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      token: token,
      username: user.userName,
      email: user.email,
      Id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      number: user.number,
      test_id: user.test_id
    })
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ status: "error", error: "Authentication failed" });
  }
};