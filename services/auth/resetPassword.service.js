const db = require("../../db/db");
const { verifyToken, decodeToken } = require("../../helpers/jwt");
const { hashPassword } = require("../../helpers/password");

exports.resetUserPassword = async (token, newPassword) => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.id || !payload.email) {
      return { status: 404, message: "Invalid token" };
    }

    const _user = await db.Student.findOne({ where: { id: payload.id } });

    const decoded = verifyToken(token, _user.password);
    if (!decoded) {
      return { status: 404, message: "Invalid token" };
    }

    const user = await db.Student.findOne({ where: { id: decoded.id } });
    if (!user) {
      return { status: 404, message: "Invalid token" };
    }

    const hashedPassword = await hashPassword(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return {
        data: {},
      status: 200,
      message: "Password has been reset successfully",
    };
  } catch (error) {
    if (error.name === "JsonWebTokenError" && error.message === "invalid signature") {
      return { status: 400, message: "Password has been reset already" };
    } else if (error.name === "TokenExpiredError") {
      return { status: 400, message: "Reset token has expired" };
    }
    console.error("Error in resetpassword.service:", error);
    throw new Error("Internal Server Error");
  }
};
