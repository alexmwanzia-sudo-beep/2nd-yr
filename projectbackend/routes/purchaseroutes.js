const express = require("express");
const router = express.Router();
const { reserveCar, payForReservation, validateReservationPayment } = require("../controllers/purchase-controllers");
const { cancelReservation } = require("../controllers/purchase-controllers");
const { handleCallbackResult, handleCallbackTimeout, handleSTKCallback } = require("../config/mpesa");

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

// M-Pesa callback routes
router.post("/result", (req, res) => {
    console.log('📥 Received M-Pesa result callback:', req.body);
    handleCallbackResult(req.body);
    res.status(200).json({ message: 'Callback processed successfully' });
});

router.post("/timeout", (req, res) => {
    console.log('⏰ Received M-Pesa timeout callback:', req.body);
    handleCallbackTimeout(req.body);
    res.status(200).json({ message: 'Timeout processed successfully' });
});

// C2B Callback routes
router.post("/confirmation", (req, res) => {
    console.log("📥 C2B Confirmation received:", req.body);
    // Process the confirmation
    res.status(200).json({ message: "Confirmation received" });
});

router.post("/validation", (req, res) => {
    console.log("🔍 C2B Validation received:", req.body);
    // Validate the transaction
    res.status(200).json({ message: "Validation received" });
});

router.post("/callback", (req, res) => {
    console.log("📱 STK Push Callback received:", req.body);
    const result = handleSTKCallback(req.body);
    console.log("Processed callback result:", result);
    res.status(200).json({ message: "Callback processed" });
});

module.exports = router;
