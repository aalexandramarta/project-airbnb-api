const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST create a new booking
router.post('/', async (req, res, next) => {
  try {
    const newBooking = await prisma.booking.create({
      data: {
        user_id: req.body.user_id,
        spot_id: req.body.spot_id,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        status_id: req.body.status_id,
        price: req.body.price,
        created: new Date() // or req.body.created if passed
      }
    });

    res.json(newBooking);
  } catch (error) {
    next(error);
  }
});

// DELETE a booking
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { booking_id: Number(id) }
    });

    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await prisma.booking.delete({
      where: { booking_id: Number(id) }
    });

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;