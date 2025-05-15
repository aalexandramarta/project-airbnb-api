//test eamil from my email to an other
//node test-mail.js

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'aalexandra.marta@gmail.com',
  subject: 'Test Email',
  text: 'If you see this, your config works!',
}, (error, info) => {
  if (error) return console.error(error);
  console.log('Email sent:', info.response);
});
