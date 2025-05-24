const express = require("express");
const {
  getBasicAnalytics,
  getUserActivity,
  getCarPopularity,
} = require("../controllers/analyticsController");

const router = express.Router();

// Define routes
router.get("/basic", getBasicAnalytics); // Get basic analytics
router.get("/user-activity", getUserActivity); // Get user activity analytics
router.get("/car-popularity", getCarPopularity); // Get car popularity analytics

module.exports = router;