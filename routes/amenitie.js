const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all amenities
router.get('/', async (req, res, next) => {
  try {
    const amenities = await prisma.amenities.findMany({
      include: {
        amenities_spots: true
      }
    });
    res.json(amenities);
  } catch (error) {
    next(error);
  }
});

// POST create a new amenity
router.post('/', async (req, res, next) => {
  try {
    const newAmenity = await prisma.amenities.create({
      data: {
        name: req.body.name
      }
    });

    res.json(newAmenity);
  } catch (error) {
    next(error);
  }
});

// PUT update an amenity
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedAmenity = await prisma.amenities.update({
      where: { amenitie_id: Number(id) },
      data: {
        name: req.body.name
      }
    });

    res.json(updatedAmenity);
  } catch (error) {
    next(error);
  }
});

// DELETE an amenity
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const existingAmenity = await prisma.amenities.findUnique({
      where: { amenitie_id: Number(id) }
    });

    if (!existingAmenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    await prisma.amenities.delete({
      where: { amenitie_id: Number(id) }
    });

    res.json({ message: "Amenity deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;