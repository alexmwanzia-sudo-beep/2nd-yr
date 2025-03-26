const express = require("express");
const router = express.Router();
const { authenticateAndProtect } = require("../middleware/authMiddleware");
const { getProfileData } = require("../controllers/profilecontrollers");

router.get("/profile", authenticateAndProtect, getProfileData);

module.exports = router;
