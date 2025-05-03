const express = require("express");
const router = express.Router();
const { sellCar, getCarReservationsController } = require("../controllers/salecontrollers");
const { authenticateAndProtect } = require("../middleware/authMiddleware");

// Route to sell a car
router.post("/sell", authenticateAndProtect, sellCar);

// Route to get reservations for a car
router.get("/reservations/:carId", authenticateAndProtect, getCarReservationsController);

module.exports = router; 