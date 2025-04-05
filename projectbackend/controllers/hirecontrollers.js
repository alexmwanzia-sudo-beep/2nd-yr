const {
  checkCarAvailability,
  getUserEmailById,
  createNotification,
} = require("../models/purchasemodels");

const {
  createHire,
  updateHireStatus,
  saveHirePaymentDetails,
  getHireByUserAndCar,            // <-- Added missing import
  getPaymentDetailsByTransactionId // <-- Added missing import
} = require("../models/hiremodels");

const { processPayment } = require("../config/mpesa");
const { sendMail } = require("../config/email");

// ✅ Hire Car Controller
const hireCar = async (req, res) => {
  console.log("🔍 Received Request Body:", req.body);
  const { user_id, car_id, phone, start_date, duration, pickup, dropoff, amount } = req.body;
  
  if (!user_id || !car_id || !phone || !start_date || !duration || !pickup || !dropoff || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const car = await checkCarAvailability(car_id);
    if (!car) {
      return res.status(400).json({ message: "Car is not available for hire" });
    }

    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    // Change status from "booked" to "pending" (assuming the allowed status is "pending")
    const status = "pending";
    const hireId = await createHire(user_id, car_id, phone, start_date, duration, pickup, dropoff, amount, status);
    if (!hireId) {
      throw new Error("Failed to create hire record.");
    }

    // Send confirmation email and notification
    await sendMail(userEmail, "Car Hire Confirmation", `Your hire request for car ID ${car_id} is confirmed.i love uuuuuu`);
    await createNotification(user_id, `Car hire confirmed for car ID ${car_id}.`);

    res.status(201).json({ message: "Car hired successfully", hireId });
  } catch (error) {
    console.error("❌ Error in hireCar controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Pay for Hire Controller
const payForHire = async (req, res) => {
  const { user_id, car_id, amount, phoneNumber } = req.body;
  console.log("🔍 Received Request Body:", req.body);

  if (!user_id || !car_id || !amount || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    const hire = await getHireByUserAndCar(user_id, car_id);
    // Update the check to look for "pending" status
    if (!hire || hire.status !== "pending") {
      return res.status(400).json({ message: "Invalid or expired hire record" });
    }

    // ✅ Call MPesa Payment WITHOUT Transaction ID
    const paymentResponse = await processPayment(amount, phoneNumber);

    if (!paymentResponse.success) {
      return res.status(400).json({ message: "MPesa payment failed, please try again." });
    }

    // Retrieve MPesa Transaction ID
    const transactionId = paymentResponse.mpesaTransactionId;

    await saveHirePaymentDetails(hire.id, amount, transactionId, "completed");
    // Update the hire status to "confirmed"
    await updateHireStatus(hire.id, "confirmed");

    await sendMail(userEmail, "Hire Payment Confirmation", `Your payment of KES ${amount} for hire ID ${hire.id} was successful.`);
    await createNotification(user_id, `Payment successful for hire ID ${hire.id}.`);

    res.status(201).json({ message: "Payment processed successfully" });
  } catch (error) {
    console.error("Error in payForHire controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Validate Hire Payment Controller
const validateHirePayment = async (req, res) => {
  const { transactionId, car_id, user_id } = req.body;
  if (!transactionId || !car_id || !user_id) {
    return res.status(400).json({ message: "Transaction ID, Car ID, and User ID are required." });
  }

  try {
    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    const hire = await getHireByUserAndCar(user_id, car_id);
    if (!hire) {
      return res.status(400).json({ message: "No matching hire record found." });
    }

    const payment = await getPaymentDetailsByTransactionId(transactionId);
    if (!payment || payment.hire_id !== hire.id) {
      return res.status(400).json({ message: "Invalid transaction ID or payment mismatch." });
    }

    if (payment.status !== "completed") {
      return res.status(400).json({ message: "Payment not completed yet." });
    }

    await updateHireStatus(hire.id, "confirmed");
    await sendMail(userEmail, "Hire Payment Validation", `Your payment has been successfully validated, and your hire for car ID ${car_id} is confirmed.`);
    await createNotification(user_id, `Payment validation successful for car ID ${car_id}.`);

    res.status(200).json({ message: "Payment validated successfully." });
  } catch (error) {
    console.error("Error in validateHirePayment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { hireCar, payForHire, validateHirePayment };
