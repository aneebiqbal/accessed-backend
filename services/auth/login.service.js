const db = require("../../db/db");
const { signToken } = require("../../helpers/jwt");
const { comparePassword } = require("../../helpers/password");

exports.loginUser = async ({ email, password }) => {
  try {
    const user = await db.Student.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { status: 400, error: "Invalid email or password" };
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return { status: 401, error: "Invalid email or password" };
    }

    const token = signToken(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      data: {
        token,
        email: user.email,
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        number: user.number,
        test_id: user.test_id,
      },
      status: 200,
      message: "success",
    };
  } catch (error) {
    console.error("Error in login.service:", error);
    throw new Error("Authentication failed");
  }
};
