const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: {
        camping_spot: {
          include: {
            user: true,        
            pictures: true,
            review: true   
          }
        }
      }
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (e) {
    next(e);
  }
});

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
        created: new Date() // or req.body.created if passed,
      }
    });

    res.json(newBooking);
  } catch (error) {
    next(error);
  }
});

// PUT update booking status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  if (![1,2,3].includes(Number(status_id))) {
    return res.status(400).json({ message: 'Invalid status_id' });
  }

  try {
    const updated = await prisma.booking.update({
      where: { booking_id: Number(id) },
      data: { status_id: Number(status_id) }
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
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