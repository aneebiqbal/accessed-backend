const { db } = require("../../db/db");
const authMiddleware = require("../../middleware/authMiddleware");
const {
  firstNameSchema,
  lastNameSchema,
  numberSchema,
} = require("../../validations/studentValidation");
const { createErrorResponse } = require("./registerController");

exports.updateUser = async (req, res) => {
  try {
    authMiddleware(req, res, async () => {
      const userId = req.user.id;
      const {
        first_name,
        last_name,
        test_id,
        number,
      } = req.body;

      const user = await db.Student.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (first_name) {
        const { error } = firstNameSchema.validate({first_name}, {
          aboutEarly: false,
        });
        if (error) {
          return res
            .status(400)
            .json(createErrorResponse(error.details[0].message));
        }

        user.first_name = first_name;
      }

      if (last_name) {
        const { error } = lastNameSchema.validate({last_name}, {
          aboutEarly: false,
        });
        if (error) {
          return res
            .status(400)
            .json(createErrorResponse(error.details[0].message));
        }

        user.last_name = last_name;
      }

      if (test_id) {
        const testExists = await db.Test.findByPk(test_id);
        if (!testExists) {
          return res
            .status(400)
            .json({ message: "Invalid test_id: Test not found" });
        }

        user.test_id = test_id;
      }

      if (number) {
        const { error } = numberSchema.validate({number}, {
          aboutEarly: false,
        });
        if (error) {
          return res
            .status(400)
            .json(createErrorResponse(error.details[0].message));
        }

        user.number = number;
      }
      await user.save();
      const updatedUser = await db.Student.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      return res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
