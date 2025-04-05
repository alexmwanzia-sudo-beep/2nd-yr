const express = require("express");
const router = express.Router();
const { hireCar, payForHire, validateHirePayment } = require("../controllers/hirecontrollers");

const { authenticateAndProtect } = require("../middleware/authMiddleware");

console.log("hireCar:", hireCar);
console.log("payForHire:", payForHire);
console.log("validateHirePayment:", validateHirePayment);

// ✅ Route to hire a car
router.post("/book", authenticateAndProtect, hireCar);

// ✅ Route to make payment for a hire
router.post("/pay", authenticateAndProtect, payForHire);

// ✅ Route to validate a hire payment (e.g., MPesa validation)
router.post("/validate-payment", authenticateAndProtect, validateHirePayment);

module.exports = router;
