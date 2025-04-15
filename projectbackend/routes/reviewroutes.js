const express = require('express');
const router = express.Router();
const { authenticateAndProtect } = require('../middleware/authMiddleware');
const {
    createCarReviewController,
    createSystemReviewController,
    getCarReviewsController,
    getSystemReviewsController,
    getUserReviewsController,
    deleteReviewController
} = require('../controllers/reviewcontrollers');

// Car review routes
router.post('/car', authenticateAndProtect, createCarReviewController);
router.get('/car/:carId', getCarReviewsController);

// System review routes
router.post('/system', authenticateAndProtect, createSystemReviewController);
router.get('/system', getSystemReviewsController);

// User review routes
router.get('/user', authenticateAndProtect, getUserReviewsController);

// Delete review
router.delete('/:reviewId', authenticateAndProtect, deleteReviewController);

module.exports = router; 