const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Student: User } = require('../../db/db');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Invalid email' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL}/auth/resetPassword?token=${resetToken}`;  // Replace with frontend URL

    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_APP_PASSWORD
      }
    });

    // Setup email options
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset',
      text: `Please reset your password using the following link: ${resetLink}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response (include resetLink for testing, remove in production)
    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email',
      resetLink  // For testing purposes, remove in production
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
