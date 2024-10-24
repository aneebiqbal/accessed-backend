const nodemailer = require("nodemailer");
const db = require("../../db/db");
const { signToken } = require("../../helpers/jwt");

exports.sendPasswordResetLink = async (email) => {
  try {
    const user = await db.Student.findOne({ where: { email } });
    if (!user) {
      return { status: 404, message: "Invalid email" };
    }

    const resetToken = signToken( { id: user.id, email: user.email },
      user.password,
      { expiresIn: "15m" })

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset",
      text: `Please reset your password using the following link: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return {
        data: {},
      status: 200,
      message: "Password reset link sent to your email",
    };
  } catch (error) {
    console.error("Error in forgotpassword.service:", error);
    throw new Error("Error sending password reset link");
  }
};
