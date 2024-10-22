const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Student: User, Test, ExternalSourceType } = require("../../db/db");
const { registrationSchema } = require("../../validations/userValidation");
const {
  studentRegistrationSchema,
} = require("../../validations/studentValidation");

const createErrorResponse = (message) => {
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
        .json(createErrorResponse(error.details[0].message));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", error: "Email already exists" });
    }

    const { first_name, last_name, email, number, test_id } = req.body;

    // Check if test_id exists in the Tests table
    const testExists = await Test.findByPk(test_id);
    if (!testExists) {
      return res.status(400).json({ message: 'Invalid test_id: Test not found' });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      number,
      email,
      password: hashedPassword,
      test_id,
    });
    const token = jwt.sign(
      { id: newUser.id, username: newUser.email },
      "secret-key",
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      token: token,
      username: newUser.userName,
      email: newUser.email,
      Id: newUser.id,
      imgUrl: newUser.imgUrl,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
};

// exports.externalSourceSignUp = async (req, res) => {
//   try {
//     // Extract data from the request body
//     const { externalSourceTypeId, email, userName, imgUrl, uuid } = req.body;
//     const existingUser = await User.findOne({
//       where: { UUID: req.body.uuid },
//     });
//     console.log(uuid, existingUser);
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ status: "error", error: "User already exists" });
//     }
//     // Create a new User record with the provided externalSourceTypeId
//     const hashedPassword = await bcrypt.hash(req.body.email, 10);

//     const newUser = await User.create({
//       email,
//       userName,
//       imgUrl,
//       UUID: uuid,
//       externalSourceTypeId,
//       password: hashedPassword,
//     });

//     const token = jwt.sign(
//       { id: newUser.id, username: newUser.userName },
//       "secret-key",
//       {
//         expiresIn: "7d",
//       }
//     );
//     res.status(200).json({
//       token: token,
//       username: newUser.userName,
//       email: newUser.email,
//       Id: newUser.id,
//       imgUrl: newUser.imgUrl,
//     });
//   } catch (error) {
//     console.error("External Sign-Up Error:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred during external sign-up" });
//   }
// };
