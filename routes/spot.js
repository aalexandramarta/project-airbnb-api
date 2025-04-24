const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET spots listing.
router.get('/', async function(req, res, next) {
    const spots = await prisma.camping_spot.findMany({
        include: {
          user: true,       // Include related user --> host
          country: true,    // Include country
          city: true,        // Include city
          pictures: true,
          booking: true,
          review: true,
          amenities_spots: {include: {amenities: true}}

        }
    })
    res.json(spots);
  });
  

// GET single spot by id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const spot = await prisma.camping_spot.findUnique({
        where: { spot_id: Number(id) },
        include: {
          user: true,
          country: true,
          city: true,
          pictures: true,
          booking: true,
          review: true,
          amenities_spots: {
            include: {amenities: true}}}
      });
  
      if (!spot) {
        return res.status(404).json({ message: "Camping spot not found" });
      }
  
      res.json(spot);
    } catch (error) {
      next(error);
    }
  });
  
// POST create a new spot
router.post('/', async (req, res, next) => {
const newSpot = await prisma.camping_spot.create({
data: { 
    user_id: req.body.user_id,
    country_id: req.body.country_id,
    city_id: req.body.city_id,
    name: req.body.name,
    location: req.body.location,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    created: req.body.created ? new Date(req.body.created) : new Date(), // automatic
    description: req.body.description,
    base_price: req.body.base_price
} 
});

    res.json(newSpot);
});

// UPDATE spot
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    
    const {
        user_id,
        country_id,
        city_id,
        name,
        location,
        latitude,
        longitude,
        created,
        description,
        base_price
    } = req.body;
    
    try {
        // Check if the spot exists
        const existingSpot = await prisma.camping_spot.findUnique({
        where: { spot_id: Number(id) }
        });
    
        if (!existingSpot) {
        return res.status(404).json({ message: "Spot not found" });
        }
    
        // Update the spot with only provided fields
        const updatedSpot = await prisma.camping_spot.update({
        where: { spot_id: Number(id) },
        data: {
            user_id: user_id ?? existingSpot.user_id,
            country_id: country_id ?? existingSpot.country_id,
            city_id: city_id ?? existingSpot.city_id,
            name: name ?? existingSpot.name,
            location: location ?? existingSpot.location,
            latitude: latitude ?? existingSpot.latitude,
            longitude: longitude ?? existingSpot.longitude,
            created: created ?? existingSpot.created,
            description: description ?? existingSpot.description,
            base_price: base_price ?? existingSpot.base_price
        }
        });
    
        res.json(updatedSpot);
    } catch (error) {
        next(error); // Let Express handle it
    }
    });

  // DELETE a spot
  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      // Check if the camping spot exists
      const existingSpot = await prisma.camping_spot.findUnique({
        where: { spot_id: Number(id) }
      });
  
      if (!existingSpot) {
        return res.status(404).json({ message: "Camping spot not found" });
      }
  
      // Delete the camping spot
      await prisma.camping_spot.delete({
        where: { spot_id: Number(id) }
      });
  
      res.json({ message: "Camping spot deleted successfully" });
    } catch (error) {
      next(error); // Let Express handle errors
    }
  });
  

module.exports = router;