const express = require("express");
const router = express.Router();
const { reserveCar, payForReservation, validateReservationPayment } = require("../controllers/purchase-controllers");
const { cancelReservation } = require("../controllers/purchase-controllers");

const { authenticateAndProtect } = require("../middleware/authMiddleware");

console.log("reserveCar:", reserveCar);
console.log("payForReservation:", payForReservation);
console.log("validateReservationPayment:", validateReservationPayment);

// ✅ Route to reserve a car (handles both temporary and paid reservations)
router.post("/reserve", authenticateAndProtect, reserveCar);

// ✅ Route to make payment for a reservation
router.post("/pay", authenticateAndProtect, payForReservation);

// ✅ Route to validate a payment (e.g., MPesa validation)
router.post("/validate-payment", authenticateAndProtect, validateReservationPayment);

// ✅ Route to cancel a reservation
router.post('/cancel/:reservationId', authenticateAndProtect, cancelReservation);

module.exports = router;
