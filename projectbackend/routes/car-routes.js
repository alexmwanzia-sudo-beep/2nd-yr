const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const { createCar, getCars, getListedCars } = require("../controllers/carcontrollers"); // Import new controller
const { authenticateAndProtect } = require("../middleware/authMiddleware");

// ✅ Route for adding a car
router.post("/add", upload.single("image"), createCar);

// ✅ Route for fetching all cars
router.get("/", getCars); // Fetches all cars from the database

// ✅ Route for fetching user's listed cars
router.get("/listed", authenticateAndProtect, getListedCars);

module.exports = router;
