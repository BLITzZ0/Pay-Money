const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.BREVO_USER, // will hold 965a73001@smtp-brevo.com
    pass: process.env.BREVO_PASS, // will hold your SMTP key value
  },
});

async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: "Pay-Money <ababhishek3005@gmail.com>", 
      to,
      subject,
      text,
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = sendEmail;
