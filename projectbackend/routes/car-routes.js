const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const { createCar, getCars } = require("../controllers/carcontrollers"); // Import relevant controllers

// ✅ Route for adding a car
router.post("/add", upload.single("image"), createCar);

// ✅ Route for fetching all cars
router.get("/", getCars); // Fetches all cars from the database

module.exports = router;
