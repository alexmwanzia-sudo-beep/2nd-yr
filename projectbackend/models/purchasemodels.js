const { pool } = require("../config/db"); // Import the database pool for queries

// ✅ Check if a car is available for reservation
const checkCarAvailability = async (carId) => {
  try {
    const sql = "SELECT * FROM cars WHERE car_id = ? AND available_for_hire = 1";
    const [results] = await pool.execute(sql, [carId]);
    return results[0]; // Returns the car object if available, or undefined if not
  } catch (error) {
    console.error("❌ Error checking car availability:", error);
    throw error;
  }
};

// ✅ Create a new reservation
const createReservation = async (userId, carId, status, expiresAt, reservationFee = null) => {
  try {
    const sql = `
      INSERT INTO reservations (user_id, car_id, status, reserved_at, expires_at, reservation_fee)
      VALUES (?, ?, ?, NOW(), ?, ?)
    `;
    const values = [userId, carId, status, expiresAt, reservationFee];
    const [result] = await pool.execute(sql, values);
    return result.insertId; // Returns the reservation ID
  } catch (error) {
    console.error("❌ Error creating reservation:", error);
    throw error;
  }
};

// ✅ Update car availability
const updateCarAvailability = async (carId, availableForHire) => {
  try {
    const sql = "UPDATE cars SET available_for_hire = ? WHERE car_id = ?";
    const [result] = await pool.execute(sql, [availableForHire, carId]);
    return result.affectedRows; // Returns the number of rows affected
  } catch (error) {
    console.error("❌ Error updating car availability:", error);
    throw error;
  }
};

// ✅ Get reservation details by ID
const getReservationById = async (reservationId) => {
  try {
    const sql = "SELECT * FROM reservations WHERE id = ?";
    const [results] = await pool.execute(sql, [reservationId]);
    return results[0]; // Returns the reservation object or undefined if not found
  } catch (error) {
    console.error("❌ Error fetching reservation by ID:", error);
    throw error;
  }
};

// ✅ Save payment details
const savePaymentDetails = async (reservationId, amount, transactionId, status) => {
  try {
    const sql = `
      INSERT INTO payments (reservation_id, amount, transaction_id, status, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const values = [reservationId, amount, transactionId, status];
    const [result] = await pool.execute(sql, values);
    return result.insertId; // Returns the payment ID
  } catch (error) {
    console.error("❌ Error saving payment details:", error);
    throw error;
  }
};

// ✅ Update reservation status
const updateReservationStatus = async (reservationId, status) => {
  try {
    const sql = "UPDATE reservations SET status = ? WHERE id = ?";
    const [result] = await pool.execute(sql, [status, reservationId]);
    return result.affectedRows; // Returns the number of rows affected
  } catch (error) {
    console.error("❌ Error updating reservation status:", error);
    throw error;
  }
};

// ✅ Fetch user notifications
const getUserNotifications = async (userId) => {
  try {
    const sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
    const [results] = await pool.execute(sql, [userId]);
    return results; // Returns an array of notifications
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    throw error;
  }
};

// ✅ Create a notification for the user
const createNotification = async (userId, message) => {
  try {
    const sql = "INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, NOW())";
    const [result] = await pool.execute(sql, [userId, message]);
    return result.insertId; // Returns the notification ID
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    throw error;
  }
};

// ✅ Export all models for use in controllers
module.exports = {
  checkCarAvailability,
  createReservation,
  updateCarAvailability,
  getReservationById,
  savePaymentDetails,
  updateReservationStatus,
  getUserNotifications,
  createNotification,
};
