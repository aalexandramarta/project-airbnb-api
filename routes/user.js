const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET users listing.
router.get('/', async function(req, res, next) {
  const data = await prisma.user.findMany({
    include: {   
      favorites: true,
      review: true,
      booking: true,
      camping_spot: true


    }});
  res.json(data);
});


// GET user by id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: Number(id) },
      include: {
        camping_spot: true, 
        favorites: {
            include: {
              camping_spot: {include: {amenities_spots: {include: {amenities: true}}}}
            }
        },
        review: {include: {camping_spot: true}},
        booking: {include: {camping_spot: true}}
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
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

//Check user at login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password 
      },
      include: {
        favorites:{include: {camping_spot: {include: {amenities_spots: {include: {amenities: true}}}}}},
        review: {include: {camping_spot: true}},
        booking: {include: {camping_spot: true}},
        camping_spot: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT update an existing user
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { email, name, password } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { user_id: Number(id) }
  });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update the user
  const updatedUser = await prisma.user.update({
    where: { user_id: Number(id) },
    data: {
      email: email ?? existingUser.email, // Only update if new value is provided
      name: name ?? existingUser.name,
      password: password ?? existingUser.password // This only falls back to existing.password if the new value is null or undefined — perfect for updates!
    }
  });

  res.json(updatedUser);
});

// DELETE a user
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { user_id: Number(id) }
  });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Delete the user
  await prisma.user.delete({
    where: { user_id: Number(id) }
  });

  res.json({ message: "User deleted successfully" });
});


module.exports = router;

