const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /city
router.post('/', async (req, res) => {
  const { name, country_id } = req.body;

  try {
    // Check if city already exists in that country
    let city = await prisma.city.findFirst({
      where: {
        name,
        country_id
      }
    });

    if (!city) {
      city = await prisma.city.create({
        data: { name, country_id }
      });
    }

    res.json(city);
  } catch (error) {
    console.error('Error in city route:', error);
    res.status(500).json({ message: 'Failed to create or fetch city' });
  }
});



  module.exports = router;