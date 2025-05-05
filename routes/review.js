const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST review
router.post('/', async (req, res, next) => {
  const { user_id, spot_id, rating, comment } = req.body;
  try {
    const review = await prisma.review.create({
      data: { user_id, spot_id, rating, comment }
    });
    res.json(review);
    } catch (e) { 
        if (e.code === 'P2002') {
            // duplicate user+spot
            return res.status(409).json({
              message: "You have already reviewed this spot."
            });
          }
          console.error("Unexpected review.create error:", e);
          return res.status(500).json({ message: "Failed to submit review." });
    }
})

module.exports = router;
