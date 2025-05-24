const express = require('express');
const router = express.Router();
const { getCars, createCar, getListedCars, getCarsForHire, updateHireStatus } = require('../controllers/carcontrollers');
const { authenticateAndProtect } = require('../middleware/authMiddleware');
const upload = require("../middleware/uploads");
router.post("/add", upload.single("image"), createCar);
// Get all cars
router.get('/', getCars);

// Get cars available for hire
router.get('/for-hire', getCarsForHire);

// Create a new car
router.post('/', createCar);

// Get user's listed cars (protected route)
router.get('/listed', authenticateAndProtect, getListedCars);

// Update hire status
router.put('/:carId/status', authenticateAndProtect, updateHireStatus);

module.exports = router;
