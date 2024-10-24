const db = require("../../db/db");
const {
  firstNameSchema,
  lastNameSchema,
  numberSchema,
} = require("../../validations/studentValidation");
const { createErrorResponse } = require("../../controllers/auth/registerController");

exports.updateUserDetails = async (userId, first_name, last_name, number) => {
  try {
    const user = await db.Student.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    if (first_name) {
      const { error } = firstNameSchema.validate({ first_name }, { aboutEarly: false });
      if (error) {
        return { status: 400, message: createErrorResponse(error.details[0].message) };
      }
      user.first_name = first_name;
    }

    if (last_name) {
      const { error } = lastNameSchema.validate({ last_name }, { aboutEarly: false });
      if (error) {
        return { status: 400, message: createErrorResponse(error.details[0].message) };
      }
      user.last_name = last_name;
    }

    if (number) {
      const { error } = numberSchema.validate({ number }, { aboutEarly: false });
      if (error) {
        return { status: 400, message: createErrorResponse(error.details[0].message) };
      }
      user.number = number;
    }

    await user.save();

    const updatedUser = await db.Student.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    return {
      data: updatedUser,
      status: 200,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Error in updateUser.service:", error);
    throw new Error("Internal server error");
  }
};
