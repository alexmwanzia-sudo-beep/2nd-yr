const { 
  getUserProfile, 
  getUserCars,
  getUserHireHistory,
  getUserReservationHistory,
  updateProfilePicture,
  saveUserProfile,
  getUserNotifications
} = require("../models/profilemodels");

/**
 * Get user profile data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfileData = async (req, res) => {
    try {
        // Log the user object to debug
        console.log("User object from token:", req.user);
        
        // Access userId from the token
        const userId = req.user.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found in token"
            });
        }
        
        // Get user profile
        const profile = await getUserProfile(userId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }
        
        // Get user's cars, hire history, and reservation history
        // Use try-catch for each to handle errors individually
        let cars = [];
        let hireHistory = [];
        let reservationHistory = [];
        
        try {
            cars = await getUserCars(userId);
        } catch (error) {
            console.error("Error fetching user cars:", error);
            // Continue with empty array
        }
        
        try {
            hireHistory = await getUserHireHistory(userId);
        } catch (error) {
            console.error("Error fetching hire history:", error);
            // Continue with empty array
        }
        
        try {
            reservationHistory = await getUserReservationHistory(userId);
        } catch (error) {
            console.error("Error fetching reservation history:", error);
            // Continue with empty array
        }
        
        // Get user notifications
        let notifications = [];
        try {
            notifications = await getUserNotifications(userId);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            // Continue with empty array
        }

        res.json({ 
            success: true,
            profile, 
            cars,
            hireHistory,
            reservationHistory,
            notifications
        });
    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profileData = {
            user_id: userId,
            ...req.body
        };

        const updatedProfile = await saveUserProfile(profileData);
        
        res.json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update profile" 
        });
    }
};

/**
 * Update profile picture
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProfilePictureController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { profile_picture } = req.body;

        if (!profile_picture) {
            return res.status(400).json({
                success: false,
                message: "Profile picture URL is required"
            });
        }

        const success = await updateProfilePicture(userId, profile_picture);
        
        if (success) {
            res.json({
                success: true,
                message: "Profile picture updated successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update profile picture" 
        });
    }
};

module.exports = { 
    getProfileData, 
    updateProfile, 
    updateProfilePictureController 
};
