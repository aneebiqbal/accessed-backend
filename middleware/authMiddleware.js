const { Student } = require("../db/db");
const { verifyToken } = require("../helpers/jwt");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    // Verify the token and extract the user ID
    const secretKey = process.env.JWT_SECRET || "secret-key";
    const decoded = verifyToken(token.replace("Bearer ", ""), secretKey);
    console.log("Decoded Token:", decoded);

    if (!decoded.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const user = await Student.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error during authentication", error);
    return res
      .status(500)
      .json({ error: "Authentication failed", details: error.message });
  }
};
