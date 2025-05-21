const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

router.post('/request', async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: 'No user with this email' });
  }

  const resetToken = uuidv4();
  const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  await prisma.password_reset.create({
    data: {
      user_id: user.user_id,
      reset_token: resetToken,
      expire_time: expireTime,
    },
  });

  const resetLink = `http://localhost:8080/reset-password?token=${resetToken}`;

  // Send email from my personal email using app password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.json({ message: 'Reset link sent' });
});


router.post('/confirm', async (req, res) => {
  const { token, newPassword } = req.body;

  const resetRequest = await prisma.password_reset.findFirst({
    where: {
      reset_token: token,
      expire_time: { gt: new Date() },
    },
  });

  if (!resetRequest) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  await prisma.user.update({
    where: { user_id: resetRequest.user_id },
    data: { password: newPassword }, 
  });

  await prisma.password_reset.deleteMany({
    where: { user_id: resetRequest.user_id },
  });

  res.json({ message: 'Password reset successful' });
});

module.exports = router;

