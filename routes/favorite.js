const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// POST create a new favorite
router.post('/', async (req, res, next) => {
  try {
const newFavorite = await prisma.favorites.create({
data: { 
    user_id: req.body.user_id,
    spot_id: req.body.spot_id
}
});

    res.json(newFavorite);
  } catch (error) {
    console.error(error);  // Log any error in the server logs
    next(error);  // Pass the error to the next error handler
  }
});


  // DELETE a favorite
  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      // Check if the favorite exists
      const existingFavorite = await prisma.favorites.findUnique({
        where: { favorite_id: Number(id) }
      });
  
      if (!existingFavorite) {
        return res.status(404).json({ message: "Favorite spot not found" });
      }
  
      // Delete the favorite
      await prisma.favorites.delete({
        where: { favorite_id: Number(id) }
      });
  
      res.json({ message: "Favorite spot deleted successfully" });
    } catch (error) {
      next(error); // Let Express handle errors
    }
  });
  

module.exports = router;