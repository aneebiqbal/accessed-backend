const db = require("../../db/db");
const authMiddleware = require("../../middleware/authMiddleware");

exports.deleteUser = (req, res) => {
  try {
    authMiddleware(req, res, async () => {
      const userId = req.user.id;
      const user = await db.User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.destroy();
      await user.save();
      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
