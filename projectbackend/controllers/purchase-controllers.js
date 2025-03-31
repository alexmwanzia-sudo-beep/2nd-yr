const {
  checkCarAvailability,
  createReservation,
  updateCarAvailability,
  getReservationById,
  savePaymentDetails,
  updateReservationStatus,
  createNotification,
  getUserEmailById 
} = require("../models/purchasemodels"); // Models for database operations
const { processPayment } = require("../config/mpesa"); // MPesa payment integration
const { sendMail } = require("../config/email"); // Email notification integration

// ✅ Reserve Car Controller (Handles both "temporary" and "paid" reservations)
const reserveCar = async (req, res) => {
  console.log("🔍 Received Request Body:", req.body);
  
  const { car_id, reservationType, user_id } = req.body; // Extract from body
  if (!car_id || !reservationType || !user_id) {
    return res.status(400).json({ message: "Car ID, reservation type, and user ID are required" });
  }

  try {
    const car = await checkCarAvailability(car_id);
    if (!car) {
      return res.status(400).json({ message: "Car is not available for reservation" });
    }

    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    const reservationStatus = reservationType === "temporary" ? "interested" : "reserved";
    const expiresAt = reservationType === "temporary" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    const reservationId = await createReservation(user_id, car_id, reservationStatus, expiresAt);

    if (reservationType === "paid") {
      await updateCarAvailability(car_id, 0);
    }

    // Send email notification
    await sendMail(userEmail, "Car Reservation", `Your reservation for car ID ${car_id} is confirmed.`);
    await createNotification(user_id, `Car reservation confirmed for car ID ${car_id}.`);

    res.status(201).json({ message: "Car reserved successfully", reservationId });
  } catch (error) {
    console.error("❌ Error in reserveCar controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Pay for Reservation Controller
const payForReservation = async (req, res) => {
  const { reservationId, amount, transactionId, phoneNumber, user_id } = req.body;

  if (!reservationId || !amount || !transactionId || !phoneNumber || !user_id) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    const reservation = await getReservationById(reservationId);
    if (!reservation || reservation.status !== "interested") {
      return res.status(400).json({ message: "Invalid or expired reservation" });
    }

    const paymentResponse = await processPayment(amount, transactionId, phoneNumber);
    console.log("MPesa Payment Response:", paymentResponse);

    const paymentId = await savePaymentDetails(reservationId, amount, transactionId, "completed");
    await updateReservationStatus(reservationId, "reserved");
    await updateCarAvailability(reservation.car_id, 0);

    await sendMail(userEmail, "Payment Confirmation", `Your payment of KES ${amount} for reservation ID ${reservationId} was successful.`);
    await createNotification(user_id, `Payment successful for reservation ID ${reservationId}.`);

    res.status(201).json({ message: "Payment processed successfully", paymentId });
  } catch (error) {
    console.error("Error in payForReservation controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Validate Payment Controller
const validateReservationPayment = async (req, res) => {
  const { transactionId, car_id, user_id } = req.body;

  if (!transactionId || !car_id || !user_id) {
    return res.status(400).json({ message: "Transaction ID, Car ID, and User ID are required." });
  }

  try {
    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    const isValidTransaction = transactionId === "valid-transaction-id";
    if (!isValidTransaction) {
      return res.status(400).json({ message: "Invalid transaction ID." });
    }

    const reservationId = await updateReservationStatus(user_id, car_id, "reserved");

    await sendMail(userEmail, "Payment Validation Confirmation", `Your payment has been successfully validated, and your reservation for car ID ${car_id} is confirmed.`);
    await createNotification(user_id, `Payment validation successful for car ID ${car_id}.`);

    res.status(200).json({ message: "Payment validated successfully.", reservationId });
  } catch (error) {
    console.error("Error in validateReservationPayment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { reserveCar, payForReservation, validateReservationPayment };
