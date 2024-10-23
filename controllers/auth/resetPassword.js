const jwt = require('jsonwebtoken');
const { db } = require('../../db/db');
const bcrypt = require('bcryptjs');

exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.query; 
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(404).json({ status: 'error', message: 'Invalid token' });
      }

    const user = await db.Student.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Invalid token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    const result = {
      status: 'success',
      message: 'Password has been reset successfully'
    }

    res.status(200).json(result);
  } catch (error) {

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ status: 'error', message: 'Reset token has expired' });
    }
    console.error('Error in resetPassword:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};