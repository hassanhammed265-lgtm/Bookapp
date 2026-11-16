const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({to, subject, html}) => {
  try {
    await transporter.sendMail({
      from: `"Bookapp" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(` Failed to send email to ${to}`);
    throw error;
  }
};

const sendWelBackEmail = async (email) => {
  await sendEmail({
    to: email,
    subject: "Welcome back to Bookapp",
    html: "<h1>Welcome back to Bookapp!</h1><p>We're glad to have you again.</p>"
  });
};

module.exports = {
  sendEmail,
  sendWelBackEmail,
};
