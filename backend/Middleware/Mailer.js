const SibApiV3Sdk = require("@sendinblue/client");

if (!process.env.BREVO_API_KEY) {
  console.error("Missing BREVO_API_KEY in .env file");
}

const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendEmail(to, subject, text) {
  try {
    const emailData = {
      sender: { name: "Pay-Money", email: "ababhishek3005@gmail.com" },
      to: [{ email: to }],
      subject,
      textContent: text,
    };

    const response = await client.sendTransacEmail(emailData);

    console.log("Email sent successfully. Message ID:", response?.body?.messageId);
    return response;
  } catch (err) {
    const errorMsg = err.response?.body || err.message || err;
    console.error("Error sending email:", errorMsg);
    throw err; 
  }
}

module.exports = sendEmail;
