const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /country
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    // Check if country already exists
    let country = await prisma.country.findUnique({
      where: { name }
    });

    if (!country) {
      country = await prisma.country.create({
        data: { name }
      });
    }

    res.json(country);
  } catch (error) {
    console.error('Error in country route:', error);
    res.status(500).json({ message: 'Failed to create or fetch country' });
  }
});
module.exports = router;
  