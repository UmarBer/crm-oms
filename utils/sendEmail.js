const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmailWithSheetLink(recipientEmail) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: 'Weekly Production Sheet',
    html: `
    <p>Hello,</p>
    <p>This is the coffee that has to be produced this week for our wholesale clients. You can access the Google sheet here:</p>
    <a href="https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}" target="_blank">View Production Sheet</a>
    <p>Best regards, Umar</p>
    `
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmailWithSheetLink;
