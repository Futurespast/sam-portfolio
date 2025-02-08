require("dotenv").config();
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, email, subject, message } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `${subject} - From: ${name}`,
    text: `Sender: ${name} (${email})\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: JSON.stringify({ success: true, message: "Email sent successfully!" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: "Error sending email", error }) };
  }
};
