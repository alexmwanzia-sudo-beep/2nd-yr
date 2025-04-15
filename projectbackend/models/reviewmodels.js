const { pool } = require('../config/db');

// Create a car review
const createCarReview = async (userId, carId, carReview, carRating) => {
    try {
        const query = `
            INSERT INTO reviews (user_id, car_id, car_review, car_rating)
            VALUES (?, ?, ?, ?)
        `;
        const values = [userId, carId, carReview, carRating];
        const [result] = await pool.execute(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Error creating car review:', error);
        throw error;
    }
};

// Create a system review
const createSystemReview = async (userId, systemReview) => {
    try {
        const query = `
            INSERT INTO reviews (user_id, system_review)
            VALUES (?, ?)
        `;
        const values = [userId, systemReview];
        const [result] = await pool.execute(query, values);
        return result.insertId;
    } catch (error) {
        console.error('Error creating system review:', error);
        throw error;
    }
};

// Get all reviews for a car
const getCarReviews = async (carId) => {
    try {
        const query = `
            SELECT 
                r.car_review,
                r.car_rating,
                r.created_at,
                u.firstname,
                u.lastname
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.car_id = ? AND r.car_review IS NOT NULL
            ORDER BY r.created_at DESC
        `;
        const [reviews] = await pool.execute(query, [carId]);
        return reviews;
    } catch (error) {
        console.error('Error getting car reviews:', error);
        throw error;
    }
};

// Get all system reviews
const getSystemReviews = async () => {
    try {
        const query = `
            SELECT 
                r.system_review,
                r.created_at,
                u.firstname,
                u.lastname
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.system_review IS NOT NULL
            ORDER BY r.created_at DESC
        `;
        const [reviews] = await pool.execute(query);
        return reviews;
    } catch (error) {
        console.error('Error getting system reviews:', error);
        throw error;
    }
};

// Get average rating for a car
const getCarAverageRating = async (carId) => {
    try {
        const query = `
            SELECT 
                COALESCE(AVG(car_rating), 0) as average_rating,
                COUNT(*) as total_reviews
            FROM reviews
            WHERE car_id = ? AND car_rating IS NOT NULL
        `;
        const [result] = await pool.execute(query, [carId]);
        return {
            averageRating: Number(result[0].average_rating) || 0,
            totalReviews: result[0].total_reviews || 0
        };
    } catch (error) {
        console.error('Error getting car average rating:', error);
        throw error;
    }
};

// Get user's reviews
const getUserReviews = async (userId) => {
    try {
        const query = `
            SELECT 
                r.*,
                c.make,
                c.model,
                c.year
            FROM reviews r
            LEFT JOIN cars c ON r.car_id = c.car_id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `;
        const [reviews] = await pool.execute(query, [userId]);
        return reviews;
    } catch (error) {
        console.error('Error getting user reviews:', error);
        throw error;
    }
};

// Check if user can review a car (has hired or reserved it)
const canUserReviewCar = async (userId, carId) => {
    try {
        const query = `
            SELECT 
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM hires 
                        WHERE user_id = ? AND car_id = ?
                    ) THEN true
                    WHEN EXISTS (
                        SELECT 1 FROM reservations 
                        WHERE user_id = ? AND car_id = ?
                    ) THEN true
                    ELSE false
                END as can_review
        `;
        const [result] = await pool.execute(query, [userId, carId, userId, carId]);
        return result[0].can_review;
    } catch (error) {
        console.error('Error checking if user can review car:', error);
        return false;
    }
};

// Delete a review
const deleteReview = async (reviewId, userId) => {
    try {
        const query = `
            DELETE FROM reviews
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await pool.execute(query, [reviewId, userId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

module.exports = {
    createCarReview,
    createSystemReview,
    getCarReviews,
    getSystemReviews,
    getUserReviews,
    deleteReview,
    getCarAverageRating,
    canUserReviewCar
}; 