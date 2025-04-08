const express = require("express");
const router = express.Router();
const { authenticateAndProtect } = require("../middleware/authMiddleware");
const { 
  getProfileData, 
  updateProfile, 
  updateProfilePictureController 
} = require("../controllers/profilecontrollers");

// Get user profile data
router.get("/profile", authenticateAndProtect, getProfileData);

// Update user profile
router.put("/profile", authenticateAndProtect, updateProfile);

// Update profile picture
router.put("/profile/picture", authenticateAndProtect, updateProfilePictureController);

module.exports = router;
