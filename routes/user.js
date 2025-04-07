const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET users listing.
router.get('/', async function(req, res, next) {
  const data = await prisma.user.findMany();
  res.json(data);
});


// POST create a new user
router.post('/', async (req, res, next) => {
  const checkUser = await prisma.user.findMany({
    where: {
      email: req.body.email
    }
  });
  if (checkUser.length > 0) {
    res.json({
      "message": "Already an user with the same email"
    });
  } else {

    const newUser = await prisma.user.create({
      data: { 
        email: req.body.email, // extra!!
        name: req.body.name,
        password: req.body.password
      }
    });
  
    res.json(newUser);
  }

});

// PUT update an existing user
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { email, name, password } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: Number(id) }
  });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update the user
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      email: email || existingUser.email, // Only update if new value is provided
      name: name || existingUser.name,
      password: password || existingUser.password
    }
  });

  res.json(updatedUser);
});

// DELETE a user
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: Number(id) }
  });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Delete the user
  await prisma.user.delete({
    where: { id: Number(id) }
  });

  res.json({ message: "User deleted successfully" });
});


module.exports = router;
