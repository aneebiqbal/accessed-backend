const { getAllTestsService } = require('../../services/auth/getAllTests.service');

exports.getAllTests = async (req, res) => {
  try {
    const result = await getAllTestsService();

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in getAllTests controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
