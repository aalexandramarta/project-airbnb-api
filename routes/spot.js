const express = require('express');
const multer = require('multer');
const router = express.Router();
const { PrismaClient, Prisma  } = require('@prisma/client');
const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
          booking: {include: {user: true}},
          review: { include: { user: true } },
          amenities_spots: {
            include: {amenities: true}
          },
          favorites: {include: {camping_spot : {include: {pictures: true}}}}
        }
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
    base_price: req.body.base_price,
    amenities_spots: {
      create: req.body.amenities_spots?.create || []
    }
} 
});

    res.json(newSpot);
});

// UPDATE spot
router.put('/:id', async (req, res, next) => {
  const spotId  = Number(req.params.id);
  const { name, description, base_price, amenities } = req.body;

  try {
    // ensure spot exists
    await prisma.camping_spot.findUniqueOrThrow({
      where: { spot_id: spotId }
    });

    // upsert each amenity by name
    const amenRows = await Promise.all(
      (amenities || []).map(n =>
        prisma.amenities.upsert({
          where:   { name: n },          // will throw if name not unique
          update:  {},
          create:  { name: n }
        })
      )
    );

    // now wipe and recreate join rows
    await prisma.amenities_spots.deleteMany({ where: { spot_id: spotId }});
    await prisma.amenities_spots.createMany({
      data: amenRows.map(a => ({
        spot_id:      spotId,
        amenitie_id:  a.amenitie_id
      }))
    });

    // finally update the other fields
    const updated = await prisma.camping_spot.update({
      where: { spot_id: spotId },
      data: {
        name,
        description,
        base_price: new Prisma.Decimal(base_price)
      },
      include: {
        pictures: true,
        booking:  true,
        review:   true,
        amenities_spots: { include: { amenities: true } }
      }
    });

    res.json(updated);
  } catch (e) {
    next(e);
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
      next(error); //  Express handling errors
    }
  });
  
  //For the pictures
  router.post('/pictures', upload.array('pictures', 10), async (req, res, next) => {
    try {
      const { spot_id } = req.body;
      const files = req.files;
  
      if (!spot_id) {
        return res.status(400).json({ message: 'Missing spot_id.' });
      }
  
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded.' });
      }
  
      const createPictures = files.map(file => ({
        spot_id: Number(spot_id),
        url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        uploaded_at: new Date()
      }));
  
      await prisma.pictures.createMany({
        data: createPictures
      });
  
      res.json({ message: 'Pictures uploaded successfully' });
  
    } catch (error) {
      console.error('Error uploading pictures:', error);
      next(error); // Pass error to Express error handler
    }
  });
  

module.exports = router;