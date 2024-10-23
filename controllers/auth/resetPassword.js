const jwt = require('jsonwebtoken');
// const { comparePassword, hashPassword } = require('../helpers/password');
// const { signToken, verifyToken } = require('../helpers/jwt');
const { Student: User } = require('../../db/db');
const bcrypt = require('bcryptjs');

exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.query; 
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(404).json({ status: 'error', message: 'Invalid token' });
      }

    // Find the user by ID (decoded from the token)
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Invalid token' });
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    // Return success response
    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    // Handle token expiration or verification failure
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ status: 'error', message: 'Reset token has expired' });
    }
    console.error('Error in resetPassword:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};