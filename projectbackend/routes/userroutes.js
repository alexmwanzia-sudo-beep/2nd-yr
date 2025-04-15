const express = require('express');
const router = express.Router();
const { authenticateAndProtect } = require('../middleware/authMiddleware');
const { getReviewableCarsController, getUserReviewsController } = require('../controllers/usercontrollers');

// Get cars that user can review (hired or reserved)
router.get('/reviewable-cars', authenticateAndProtect, getReviewableCarsController);

// Get user's reviews
router.get('/reviews', authenticateAndProtect, getUserReviewsController);

module.exports = router; 