const nodemailer = require("nodemailer");

// Configure Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider
  auth: {
    user: 'ale308022@gmail.com', // Your email address
    pass: '20325ffs', // Your email password (use app password if needed)
  },
});

// Function to send email
const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Car Reservation System" <ale308022@gmail.com>`, // Replace process.env.EMAIL_USER with actual email
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message); // Improved error logging
    throw new Error("Failed to send email");
  }
};

module.exports = { sendMail };
