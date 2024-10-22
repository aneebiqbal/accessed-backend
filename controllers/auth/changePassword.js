const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Student: User } = require("../../db/db");
const authMiddleware = require("../../middleware/authMiddleware");
const { passwordSchema } = require("../../validations/studentValidation");
const { createErrorResponse } = require("./registerController");

exports.changePassword = async (req, res) => {
  try {
    // Use the authMiddleware to fetch the userID from the token
    authMiddleware(req, res, async () => {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const userId = req.user.id;

      const password = newPassword

      const { error } = passwordSchema.validate({password}, {
        aboutEarly: false,
      });
      if (error) {
        return res
          .status(400)
          .json(createErrorResponse(error.details));
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New Passwords do not match" });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Old password is incorrect" });
      }

      // Generate a new token with updated user information
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.userName },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({ password: hashedPassword });
      const result = {
        token: token,
        id: user.id,
        username: user.userName,
        email: user.email,
        // imgUrl: user.imgUrl
      };
      // Respond with the new token and a success message
      res.status(200).json({ result, message: "Password changed successfully" });
    });
  } catch (error) {
    console.error("Error while changing password:", error);
    res
      .status(500)
      .json({ error: "Password change failed", details: error.message });
  }
};
