const { registerUser } = require("../../services/auth/register.service");
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

    const { first_name, last_name, password, number, email, test_id } =
      req.body;
    const result = await registerUser({
      first_name,
      last_name,
      password,
      number,
      email,
      test_id,
    });

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in controller register:", error);
    res.status(500).send("Error registering user");
  }
};
