const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /country
router.post('/', async (req, res, next) => {
    try {
      const newCountry = await prisma.country.create({
        data: {
          name: req.body.name
        }
      });
  
      res.json(newCountry);
    } catch (error) {
      next(error);
    }
  });
module.exports = router;
  