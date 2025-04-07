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
        email: req.body.name // extra!!
      }
    });
  
    res.json(newUser);
  }

})
module.exports = router;
