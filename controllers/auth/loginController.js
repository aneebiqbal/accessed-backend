const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../db/db");

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email.toLowerCase() } });

    if (!user) {
      return res.status(400).json({ status: "error", error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", error: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secret-key",
      {
        expiresIn: "7d",
      }
    );

    const result = {
      token: token,
      id: user.id,
      username: user.userName,
      email: user.email,
      imgUrl: user.imgUrl
    };

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ status: "error", error: "Authentication failed" });
  }
};




exports.signInExternalSource = async (req, res) => {
  try {
    const { externalSourceTypeId, uuid } = req.body;
    if (!uuid) {
      return res.status(400).json({ status: "error", error: "UUID is required" });
    }
    const user = await User.findOne({
      where: { UUID: uuid, externalSourceTypeId: externalSourceTypeId }
    });
   

    if (!user) {
      return res.status(400).json({ status: "error", error: "User not found" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, UUID: user.uuid },
      "secret-key",
      {
        expiresIn: "7d",
      }
    );

    const result = {
      token: token,
      id: user.id,
      username: user.userName,
      email: user.email,
      imgUrl: user.imgUrl
    };

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ status: "error", error: "Authentication failed" });
  }
};
