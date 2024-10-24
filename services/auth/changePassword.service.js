const db = require("../../db/db");
const { passwordSchema } = require("../../validations/studentValidation");
const { createErrorResponse } = require("../../controllers/auth/registerController");
const { signToken } = require("../../helpers/jwt");
const { comparePassword, hashPassword } = require("../../helpers/password");

exports.changeUserPassword = async (userId, oldPassword, newPassword, confirmPassword) => {
  try {
    const { error } = passwordSchema.validate({ password: newPassword }, { aboutEarly: false });
    if (error) {
      return { status: 400, message: createErrorResponse(error.details[0].message) };
    }

    if (newPassword !== confirmPassword) {
      return { status: 400, message: "New Passwords do not match" };
    }

    if (newPassword === oldPassword) {
      return { status: 400, message: "New Password cannot be the same as old password" };
    }

    const user = await db.Student.findByPk(userId);
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      return { status: 401, message: "Old password is incorrect" };
    }

    const hashedPassword = await hashPassword(newPassword, 10);
    await user.update({ password: hashedPassword });

    const token = signToken({ id: user.id, email: user.email, username: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "7d" })

    return {
      data: {
        token: token,
        id: user.id,
        email: user.email,
      },
      status: 200,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Error in changepassword.service:", error);
    throw new Error("Password change failed");
  }
};
