const { getReviewableCars, getUserReviews } = require('../models/usermodels');

// Get cars that user can review (hired or reserved)
const getReviewableCarsController = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('Fetching reviewable cars for user:', userId);
        
        const cars = await getReviewableCars(userId);
        console.log(`Found ${cars.length} reviewable cars for user ${userId}`);

        res.status(200).json({
            success: true,
            data: { 
                cars,
                message: cars.length > 0 
                    ? `Found ${cars.length} cars available for review` 
                    : 'No cars available for review'
            }
        });
    } catch (error) {
        console.error('Error in getReviewableCarsController:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviewable cars',
            error: error.message
        });
    }
};

// Get user's reviews
const getUserReviewsController = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('Fetching reviews for user:', userId);
        
        const reviews = await getUserReviews(userId);
        console.log(`Found ${reviews.length} reviews for user ${userId}`);

        res.status(200).json({
            success: true,
            data: { 
                reviews,
                message: reviews.length > 0 
                    ? `Found ${reviews.length} reviews` 
                    : 'No reviews found'
            }
        });
    } catch (error) {
        console.error('Error in getUserReviewsController:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews',
            error: error.message
        });
    }
};

module.exports = {
    getReviewableCarsController,
    getUserReviewsController
}; 