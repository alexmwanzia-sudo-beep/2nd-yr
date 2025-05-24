const express = require("express");
const {
    addFavoriteController,
    getFavoritesController,
    removeFavoriteController,
    checkFavoriteController
} = require("../controllers/favoriteController");
const { authenticateAndProtect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply authentication middleware to all favorite routes
router.use(authenticateAndProtect);

// Add to favorites
router.post("/add", addFavoriteController);

// Get user's favorites
router.get("/list", getFavoritesController); // Changed from /:userId to /list

// Remove from favorites
router.delete("/remove", removeFavoriteController); // Simplified route

// Check favorite status
router.get("/check/:carId", checkFavoriteController);

module.exports = router;