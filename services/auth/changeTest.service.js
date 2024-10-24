const db = require("../../db/db");

exports.changeUserTest = async (userId, test_id) => {
  try {
    const user = await db.Student.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const testExists = await db.Test.findByPk(test_id);
    if (!testExists) {
      return { status: 400, message: "Invalid test_id: Test not found" };
    }

    user.test_id = test_id;
    await user.save();

    return {
      data: {
        testId: user.test_id,
      },
      status: 200,
      message: "Test changed successfully",
    };
  } catch (error) {
    console.error("Error in changeTest.service:", error);
    throw new Error("Internal server error");
  }
};
