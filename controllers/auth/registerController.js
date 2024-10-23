const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db/db");
const {
  studentRegistrationSchema,
} = require("../../validations/studentValidation");

exports.createErrorResponse = (message) => {
  return { status: "error", error: message };
};

exports.register = async (req, res) => {
  try {
    const { error } = studentRegistrationSchema.validate(req.body, {
      aboutEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json(this.createErrorResponse(error.details[0].message));
    }

    const { first_name, last_name, password, number, test_id } = req.body;

    const email = req.body.email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await db.Student.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", error: "Email already exists" });
    }

    const testExists = await db.Test.findByPk(test_id);
    if (!testExists) {
      return res
        .status(400)
        .json({ message: "Invalid test_id: Test not found" });
    }

    const newUser = await db.Student.create({
      first_name,
      last_name,
      number,
      email,
      password: hashedPassword,
      test_id,
    });
    const token = jwt.sign(
      { id: newUser.id, username: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const result = {
      data: {
        token: token,
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

    res.status(200).json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
};
