const express = require("express");
const router = express.Router();
const { 
    hireCar, 
    payForHire, 
    validateHirePayment, 
    cancelHire,
    confirmReceipt,
    confirmReturn
} = require("../controllers/hirecontrollers");

const { authenticateAndProtect } = require("../middleware/authMiddleware");

console.log("hireCar:", hireCar);
console.log("payForHire:", payForHire);
console.log("validateHirePayment:", validateHirePayment);
console.log("confirmReceipt:", confirmReceipt);
console.log("confirmReturn:", confirmReturn);

// ✅ Route to hire a car
router.post("/book", authenticateAndProtect, hireCar);

// ✅ Route to make payment for a hire
router.post("/pay", authenticateAndProtect, payForHire);

// ✅ Route to validate a hire payment (e.g., MPesa validation)
router.post("/validate-payment", authenticateAndProtect, validateHirePayment);

// ✅ Route to cancel a hire
router.post('/cancel/:hireId', authenticateAndProtect, cancelHire);

// ✅ Route to confirm receipt of a car
router.post('/confirm-receipt/:hireId', authenticateAndProtect, confirmReceipt);

// ✅ Route to confirm return of a car
router.post('/confirm-return/:hireId', authenticateAndProtect, confirmReturn);

module.exports = router;
