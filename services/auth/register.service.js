const db = require("../../db/db");
const { signToken } = require("../../helpers/jwt");
const { hashPassword } = require("../../helpers/password");

exports.registerUser = async ({ first_name, last_name, password, number, email, test_id }) => {
  try {
    email = email.toLowerCase();

    const existingUser = await db.Student.findOne({ where: { email: email } });
    if (existingUser) {
      return { status: 400, error: "Email already exists" };
    }

    const testExists = await db.Test.findByPk(test_id);
    if (!testExists) {
      return { status: 400, error: "Invalid test_id: Test not found" };
    }

    const hashedPassword = await hashPassword(password, 10);

    const newUser = await db.Student.create({
      first_name,
      last_name,
      number,
      email,
      password: hashedPassword,
      test_id,
    });

    const token = signToken(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      data: {
        token,
        email: newUser.email,
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        number: newUser.number,
        test_id: newUser.test_id,
      },
      status: 200,
      message: "success",
    };
  } catch (error) {
    console.error("Error in register.service:", error);
    throw new Error("Error registering user");
  }
};
