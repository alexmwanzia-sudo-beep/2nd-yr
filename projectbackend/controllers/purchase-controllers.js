const {
  checkCarAvailability,
  createReservation,
  updateCarAvailability,
  getReservationById,
  savePaymentDetails,
  updateReservationStatus,
  createNotification,
} = require("../models/purchasemodels"); // Models for database operations
const { processPayment } = require("../config/mpesa"); // MPesa payment integration
const { sendMail } = require("../config/email"); // Email notification integration

// ✅ Reserve Car Controller (Handles both "temporary" and "paid" reservations)
const reserveCar = async (req, res) => {
  const { carId, reservationType } = req.body;

  if (!carId || !reservationType) {
    return res.status(400).json({ message: "Car ID and reservation type are required" });
  }

  try {
    // Check car availability
    const car = await checkCarAvailability(carId);
    if (!car) {
      return res.status(400).json({ message: "Car is not available for reservation" });
    }

    // Determine reservation status and expiration
    const reservationStatus = reservationType === "temporary" ? "interested" : "reserved";
    const expiresAt = reservationType === "temporary" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    // Create reservation in the database
    const reservationId = await createReservation(req.user.userId, carId, reservationStatus, expiresAt);

    // Update car availability for permanent reservation
    if (reservationType === "paid") {
      await updateCarAvailability(carId, 0); // Mark car as unavailable
    }g

    // Send email notification
    const emailSubject =
      reservationType === "temporary"
        ? "Car Reservation Confirmation - Temporary"
        : "Car Reservation Confirmation - Paid";
    const emailBody =
      reservationType === "temporary"
        ? `You have successfully reserved the car: ${car.make} ${car.model}. This reservation will expire in 24 hours unless payment is completed.`
        : `You have successfully reserved the car: ${car.make} ${car.model}. Thank you for your payment!`;
    await sendMail(req.user.email, emailSubject, emailBody);

    // Create system notification
    const notificationMessage =
      reservationType === "temporary"
        ? `Temporary reservation created for car: ${car.make} ${car.model}.`
        : `Paid reservation confirmed for car: ${car.make} ${car.model}.`;
    await createNotification(req.user.userId, notificationMessage);

    res.status(201).json({ message: "Car reserved successfully", reservationId });
  } catch (error) {
    console.error("Error in reserveCar controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Pay for Reservation Controller
const payForReservation = async (req, res) => {
  const { reservationId, amount, transactionId, phoneNumber } = req.body;

  if (!reservationId || !amount || !transactionId || !phoneNumber) {
    return res.status(400).json({
      message: "Reservation ID, amount, transaction ID, and phone number are required.",
    });
  }

  try {
    // Verify reservation details
    const reservation = await getReservationById(reservationId);
    if (!reservation || reservation.status !== "interested") {
      return res.status(400).json({ message: "Invalid or expired reservation" });
    }

    // Process MPesa payment
    const paymentResponse = await processPayment(amount, transactionId, phoneNumber);
    console.log("MPesa Payment Response:", paymentResponse);

    // Save payment details
    const paymentId = await savePaymentDetails(reservationId, amount, transactionId, "completed");

    // Update reservation and car statuses
    await updateReservationStatus(reservationId, "reserved");
    await updateCarAvailability(reservation.car_id, 0); // Mark car as unavailable

    // Send email notification
    await sendMail(
      req.user.email,
      "Payment Confirmation",
      `Your payment of KES ${amount} for reservation ID ${reservationId} was successful.`
    );

    // Create system notification
    await createNotification(req.user.userId, `Payment successful for reservation ID ${reservationId}.`);

    res.status(201).json({ message: "Payment processed successfully", paymentId });
  } catch (error) {
    console.error("Error in payForReservation controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Validate Payment Controller
const validateReservationPayment = async (req, res) => {
  const { transactionId, carId, userId } = req.body;

  if (!transactionId || !carId || !userId) {
    return res.status(400).json({ message: "Transaction ID, Car ID, and User ID are required." });
  }

  try {
    // Simulate validation (replace with MPesa API logic)
    const isValidTransaction = transactionId === "valid-transaction-id";
    if (!isValidTransaction) {
      return res.status(400).json({ message: "Invalid transaction ID." });
    }

    // Update reservation status to "confirmed"
    const reservationId = await updateReservationStatus(userId, carId, "reserved");

    // Send email notification for successful validation
    await sendMail(
      req.user.email,
      "Payment Validation Confirmation",
      `Your payment has been successfully validated, and your reservation for car ID ${carId} is confirmed.`
    );

    res.status(200).json({
      message: "Payment validated successfully.",
      reservationId,
    });
  } catch (error) {
    console.error("Error in validateReservationPayment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { reserveCar, payForReservation, validateReservationPayment };

