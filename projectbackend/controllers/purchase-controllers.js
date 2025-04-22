const { 
  checkCarAvailability,
  createReservation,
  updateCarAvailability,
  savePaymentDetails,
  createNotification,
  getUserEmailById,
  getPaymentDetailsByTransactionId,
  getReservationByUserAndCar,
  updateReservationStatus,
  getReservationById,
  updateReservationPaymentStatus
} = require("../models/purchasemodels");
const { processPayment } = require("../config/mpesa");
const { sendMail } = require("../config/email");

// ✅ Reserve Car Controller
const reserveCar = async (req, res) => {
  console.log("🔍 Received Request Body:", JSON.stringify(req.body, null, 2));

  const { car_id, reservationType, amount, phoneNumber, user_id } = req.body;

  if (!car_id || !reservationType || !user_id) {
    return res.status(400).json({ message: "Car ID, reservation type, and user ID are required." });
  }

  if (reservationType === "paid" && (!amount || !phoneNumber)) {
    return res.status(400).json({ message: "Amount and phone number are required for paid reservations." });
  }

  try {
    console.log(`🔍 Checking availability for Car ID: ${car_id}`);
    const car = await checkCarAvailability(car_id);
    if (!car) {
      return res.status(400).json({ message: "Car is not available for reservation" });
    }

    console.log(`🔍 Fetching user email for User ID: ${user_id}`);
    const userEmail = await getUserEmailById(user_id);
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found." });
    }

    // ✅ STEP 1: Create reservation first
    const reservationStatus = reservationType === "temporary" ? "interested" : "reserved";
    const expiresAt = reservationType === "temporary" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    console.log("🚀 Creating reservation...");
    const reservationId = await createReservation(user_id, car_id, reservationStatus, expiresAt, amount);
    console.log("✅ Reservation created successfully with ID:", reservationId);

    let transactionId = null;

    // ✅ STEP 2: Process payment after reservation is created
    if (reservationType === "paid") {
      console.log("🚀 Initiating MPesa Payment...");
      const paymentResponse = await processPayment(amount, phoneNumber);
      console.log("✅ MPesa Payment Response:", JSON.stringify(paymentResponse, null, 2));
  
      if (!paymentResponse || paymentResponse.success === false) {
          console.error("❌ MPesa Payment Failed:", paymentResponse);
          return res.status(400).json({ 
              message: "MPesa payment failed", 
              details: paymentResponse 
          });
      }
  
      // Get transaction ID from the correct field in the response
      transactionId = paymentResponse.mpesaTransactionId;
      
      if (!transactionId) {
          console.warn("⚠ Warning: Transaction ID is missing in payment response:", paymentResponse);
          return res.status(400).json({ 
              message: "Payment processing error - missing transaction reference",
              details: paymentResponse 
          });
      }
  
      console.log("✅ Confirmed Transaction ID:", transactionId);
  
      // Save payment details
      await savePaymentDetails(reservationId, amount, transactionId, "completed");
      console.log("✅ Payment details saved successfully.");
  
      await updateCarAvailability(car_id, 0);
      console.log("✅ Car availability updated.");
  }

    // ✅ Send confirmation email & notification
    await sendMail(userEmail, "Car Reservation", `Your reservation for car ID ${car_id} is confirmed.`);
    await createNotification(user_id, `Car reservation confirmed for car ID ${car_id}.`);
    console.log("📩 Email & Notification sent.");

    res.status(201).json({  success:true , message: "Car reserved successfully", reservationId });
  } catch (error) {
    console.error("❌ Error in reserveCar controller:", error.sqlMessage || error.message);
    res.status(500).json({ message: "Server error" });
  }
};




// ✅ Pay for Reservation Controller (Payment confirmation handled in reserveCar)
const payForReservation = async (req, res) => {
  res.status(400).json({ message: "Payment is now handled directly in the reservation process." });
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

    const payment = await getPaymentDetailsByTransactionId(transactionId);
    if (!payment) {
      return res.status(400).json({ message: "Invalid transaction ID." });
    }

    const reservation = await getReservationByUserAndCar(user_id, car_id);
    if (!reservation) {
      return res.status(400).json({ message: "No matching reservation found." });
    }

    // Update reservation status to 'reserved'
    await updateReservationStatus(reservation.id, "reserved");
    await updateCarAvailability(car_id, 0);

    // Send email and create notification
    await sendMail(userEmail, "Payment Validation Confirmation", `Your payment has been successfully validated, and your reservation for car ID ${car_id} is confirmed.`);
    await createNotification(user_id, `Payment validation successful for car ID ${car_id}.`);

    res.status(200).json({ message: "Payment validated successfully." });
  } catch (error) {
    console.error("Error in validateReservationPayment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel a reservation
const cancelReservation = async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const userId = req.user.userId;

        console.log(`Attempting to cancel reservation ${reservationId} for user ${userId}`);

        // Get reservation details
        const reservation = await getReservationById(reservationId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        // Check if the reservation belongs to the user
        if (reservation.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation' });
        }

        // Only allow cancellation of active reservations
        const currentStatus = reservation.status?.toLowerCase();
        if (!['reserved', 'interested'].includes(currentStatus)) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot cancel reservation in current status: ${currentStatus}` 
            });
        }

        // Mark the reservation as expired (this is our cancellation status)
        await updateReservationStatus(reservationId, 'expired');
        
        // Update car availability back to true (available)
        await updateCarAvailability(reservation.car_id, true);

        res.json({ success: true, message: 'Reservation cancelled successfully' });
    } catch (error) {
        console.error('❌ Error in cancelReservation controller:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { reserveCar, payForReservation, validateReservationPayment, cancelReservation };
