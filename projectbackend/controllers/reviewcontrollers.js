const {
    createCarReview,
    createSystemReview,
    getCarReviews,
    getSystemReviews,
    getUserReviews,
    deleteReview,
    getCarAverageRating,
    canUserReviewCar
} = require('../models/reviewmodels');

// Create a car review
const createCarReviewController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { carId, carReview, carRating } = req.body;

        // Validate input
        if (!carId || !carReview || !carRating) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate rating
        if (carRating < 1 || carRating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if user can review this car
        const canReview = await canUserReviewCar(userId, carId);
        if (!canReview) {
            return res.status(403).json({
                success: false,
                message: 'You can only review cars you have hired or reserved'
            });
        }

        // Create the review
        const reviewId = await createCarReview(userId, carId, carReview, carRating);

        res.status(201).json({
            success: true,
            message: 'Car review created successfully',
            data: { reviewId }
        });
    } catch (error) {
        console.error('Error in createCarReviewController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create a system review
const createSystemReviewController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { systemReview } = req.body;

        // Validate input
        if (!systemReview) {
            return res.status(400).json({
                success: false,
                message: 'System review is required'
            });
        }

        // Create the review
        const reviewId = await createSystemReview(userId, systemReview);

        res.status(201).json({
            success: true,
            message: 'System review created successfully',
            data: { reviewId }
        });
    } catch (error) {
        console.error('Error in createSystemReviewController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all reviews for a car
const getCarReviewsController = async (req, res) => {
    try {
        const { carId } = req.params;

        if (!carId) {
            return res.status(400).json({
                success: false,
                message: 'Car ID is required'
            });
        }

        const reviews = await getCarReviews(carId);
        const ratingData = await getCarAverageRating(carId);

        res.status(200).json({
            success: true,
            data: {
                reviews,
                averageRating: ratingData.averageRating,
                totalReviews: ratingData.totalReviews
            }
        });
    } catch (error) {
        console.error('Error in getCarReviewsController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all system reviews
const getSystemReviewsController = async (req, res) => {
    try {
        const reviews = await getSystemReviews();

        res.status(200).json({
            success: true,
            data: { reviews }
        });
    } catch (error) {
        console.error('Error in getSystemReviewsController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get user's reviews
const getUserReviewsController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const reviews = await getUserReviews(userId);

        res.status(200).json({
            success: true,
            data: { reviews }
        });
    } catch (error) {
        console.error('Error in getUserReviewsController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete a review
const deleteReviewController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { reviewId } = req.params;

        if (!reviewId) {
            return res.status(400).json({
                success: false,
                message: 'Review ID is required'
            });
        }

        const success = await deleteReview(reviewId, userId);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or you do not have permission to delete it'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteReviewController:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    createCarReviewController,
    createSystemReviewController,
    getCarReviewsController,
    getSystemReviewsController,
    getUserReviewsController,
    deleteReviewController
}; 