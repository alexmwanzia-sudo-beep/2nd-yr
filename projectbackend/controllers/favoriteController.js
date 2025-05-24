const { addFavorite, getFavorites, removeFavorite, checkFavorite } = require("../models/favoritesmodel");
const { pool } = require("../config/db");

// ✅ Add a car to the user's favorites
const addFavoriteController = async (req, res) => {
    try {
        // Log incoming request data
        console.log('Add favorite request received');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request user:', req.user);

        // Extract data
        const userId = req.user.userId; // Get userId directly from JWT
        const { carId } = req.body;

        // Log extracted data
        console.log('Extracted userId:', userId);
        console.log('Extracted carId:', carId);

        if (!userId) {
            console.error('No user ID found in request');
            return res.status(401).json({ 
                success: false, 
                message: "Authentication failed: User ID not found" 
            });
        }

        if (!carId) {
            console.error('No car ID found in request');
            return res.status(400).json({ 
                success: false, 
                message: "Car ID is required." 
            });
        }

        try {
            const result = await addFavorite(userId, carId);
            console.log('Database operation result:', result);
            
            if (result.affectedRows > 0) {
                console.log('✅ Added car ' + carId + ' to favorites for user ' + userId);
                return res.status(201).json({ 
                    success: true,
                    message: "Car added to favorites successfully!" 
                });
            }
            
            res.status(200).json({ 
                success: false,
                message: "Car is already in favorites." 
            });
        } catch (error) {
            console.error("❌ Error adding favorite:", error);
            console.error('Error stack:', error.stack);
            
            // Handle specific error cases
            if (error.message === "Car does not exist") {
                return res.status(404).json({ 
                    success: false,
                    message: "This car is no longer available in the system." 
                });
            }
            
            res.status(500).json({ 
                success: false,
                message: "An error occurred while adding to favorites. Please try again later." 
            });
        }
    } catch (error) {
        console.error("❌ Error in addFavoriteController:", error);
        res.status(500).json({ 
            success: false,
            message: "An unexpected error occurred. Please try again later." 
        });
    }
};

// ✅ Get all favorite cars for a user
const getFavoritesController = async (req, res) => {
    try {
        // Log incoming request data
        console.log('Get favorites request received');
        console.log('Request headers:', req.headers);
        console.log('Request user:', req.user);

        const userId = req.user.userId;
        
        if (!userId) {
            console.error('No user ID found in request');
            return res.status(401).json({ 
                success: false,
                message: "Authentication failed: User ID not found" 
            });
        }

        try {
            const favorites = await getFavorites(userId);
            console.log('Database query result:', favorites);
            console.log(`Retrieved ${favorites.length} favorites for user ${userId}`);
            
            // Log the first favorite if any
            if (favorites && favorites.length > 0) {
                console.log('First favorite:', favorites[0]);
            }

            // Simplify response format to match frontend expectations
            res.status(200).json(favorites);
        } catch (error) {
            console.error("❌ Error fetching favorites:", error);
            console.error('Error stack:', error.stack);
            
            // Handle specific error cases
            if (error.message === "No favorites found") {
                return res.status(404).json({ 
                    success: false,
                    message: "No favorites found" 
                });
            }
            
            res.status(500).json({ 
                success: false,
                message: "An error occurred while fetching favorites. Please try again later." 
            });
        }
    } catch (error) {
        console.error("❌ Error in getFavoritesController:", error);
        res.status(500).json({ 
            success: false,
            message: "An unexpected error occurred. Please try again later." 
        });
    }
};

// Remove a car from the user's favorites
const removeFavoriteController = async (req, res) => {
    try {
        // Get user ID from auth middleware
        const { userId } = req.user;
        const { carId } = req.body;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "User not authenticated" 
            });
        }
        if (!carId) {
            return res.status(400).json({ 
                success: false,
                message: "Car ID is required." 
            });
        }

        // Convert carId to number
        const numericCarId = parseInt(carId, 10);
        if (isNaN(numericCarId)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid car ID format." 
            });
        }

        try {
            const result = await removeFavorite(userId, numericCarId);
            if (result > 0) {
                console.log(`✅ Removed car ${carId} from favorites for user ${userId}`);
                return res.status(200).json({ 
                    success: true,
                    message: "Car removed from favorites successfully!" 
                });
            }
            res.status(404).json({ 
                success: false,
                message: "Car not found in favorites." 
            });
        } catch (error) {
            console.error(`❌ Error removing favorite: ${error.message}`);
            res.status(500).json({ 
                success: false,
                message: error.message
            });
        }
    } catch (error) {
        console.error("Error in removeFavoriteController:", error);
        res.status(500).json({ 
            success: false,
            message: "An unexpected error occurred. Please try again later." 
        });
    }
};

// Check if a car is in the user's favorites
const checkFavoriteController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { carId } = req.params;

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Authentication required" 
            });
        }

        if (!carId) {
            return res.status(400).json({ 
                success: false,
                message: "Car ID is required" 
            });
        }

        try {
            const isFavorite = await checkFavorite(userId, carId);
            console.log(`Checked favorite status for car ${carId}, user ${userId}`);
            res.status(200).json({ 
                success: true,
                isFavorited: isFavorite 
            });
        } catch (error) {
            console.error("Error checking favorite:", error);
            
            // Handle specific error cases
            if (error.message === "Car does not exist") {
                return res.status(404).json({ 
                    success: false,
                    message: "This car is no longer available in the system" 
                });
            }
            
            res.status(500).json({ 
                success: false,
                message: "An error occurred while checking favorite status. Please try again later." 
            });
        }
    } catch (error) {
        console.error("Error in checkFavoriteController:", error);
        res.status(500).json({ 
            success: false,
            message: "An unexpected error occurred. Please try again later." 
        });
    }
};

module.exports = {
    addFavoriteController,
    getFavoritesController,
    removeFavoriteController,
    checkFavoriteController
};