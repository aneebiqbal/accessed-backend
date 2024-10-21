const { User } = require("../../db/db");
const authMiddleware = require("../../middleware/authMiddleware");

exports.updateUser = async (req, res) => {
  try {
    authMiddleware(req, res, async () => {
      const userId = req.user.id;
      const { userName, email, imageUrl } = req.body;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (userName) {
        user.userName = userName;
      }

      if (email !== null && email !== undefined) {
        user.email = email;
      }

      if (imageUrl) {
        user.imgUrl = imageUrl;
      }
      await user.save();
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      return res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
