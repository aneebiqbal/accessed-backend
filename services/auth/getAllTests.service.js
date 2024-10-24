const db = require("../../db/db");

exports.getAllTestsService = async () => {
  try {
    const tests = await db.Test.findAll(); // Fetch all records from the Test table

    if (!tests || tests.length === 0) {
      return { status: 404, message: "No tests found" };
    }

    return {
      data: tests,
      status: 200,
      message: "Tests retrieved successfully",
    };
  } catch (error) {
    console.error("Error in getAllTests service:", error);
    throw new Error("Internal server error");
  }
};
