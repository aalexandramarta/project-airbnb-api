const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /city
router.post('/', async (req, res, next) => {
    try {
      const newCity = await prisma.city.create({
        data: {
          name: req.body.name,
          country_id: req.body.country_id
        }
      });
  
      res.json(newCity);
    } catch (error) {
      next(error);
    }
  });
  module.exports = router;