const { pool } = require("../config/db"); // Database connection
const { checkCarAvailability } = require("./purchasemodels"); // Reuse from purchase

// ✅ Create a new hire record with improved validation
const createHire = async (user_id, car_id, phone, start_date, duration, pickup, dropoff, amount, status) => {
  try {
    // Validate inputs before inserting
    if (!user_id || !car_id || !phone || !start_date || !duration || !pickup || !dropoff || !amount || !status) {
      throw new Error("Missing required fields in hire request.");
    }

    // Restrict status values to prevent unwanted updates
    const allowedStatuses = ["pending", "confirmed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid hire status.");
    }

    const sql = `INSERT INTO hires (user_id, car_id, phone, start_date, duration, pickup, dropoff, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
    const values = [user_id, car_id, phone, start_date, duration, pickup, dropoff, amount, status];
    const [result] = await pool.execute(sql, values);
    console.log(`✅ Hire record created successfully. Hire ID: ${result.insertId}`);
    return result.insertId; // Returns the hire ID
  } catch (error) {
    console.error(`❌ Error in createHire() at ${new Date().toISOString()}:`, error.message);
    throw new Error("Failed to create hire record.");
  }
};

// ✅ Update hire status with validation
const updateHireStatus = async (hireId, status) => {
  try {
    // Check if hire record exists
    const [existingHire] = await pool.execute("SELECT id FROM hires WHERE id = ?", [hireId]);
    if (!existingHire.length) {
      throw new Error("Hire record not found.");
    }

    // Restrict status values to prevent unwanted updates
    const allowedStatuses = ["pending", "confirmed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status update.");
    }

    const sql = "UPDATE hires SET status = ? WHERE id = ?";
    const [result] = await pool.execute(sql, [status, hireId]);
    console.log(`✅ Hire status updated for ID ${hireId}: ${status}`);
    return result.affectedRows; // Returns the number of rows affected
  } catch (error) {
    console.error(`❌ Error in updateHireStatus() at ${new Date().toISOString()}:`, error.message);
    throw error;
  }
};

// ✅ Save hire payment details with structured logging
const saveHirePaymentDetails = async (hireId, amount, transactionId, status) => {
  try {
    // Ensure transaction ID is valid
    const validTransactionId = transactionId || "UNKNOWN"; // Avoid undefined errors

    if (!hireId || !amount || !validTransactionId || !status) {
      throw new Error("Missing required fields in hire payment request.");
    }

    console.log(`💾 Storing Payment Details: Hire ID ${hireId}, Amount: ${amount}, Transaction ID: ${validTransactionId}`);

    const sql = `
      INSERT INTO hire_payments (hire_id, amount, transaction_id, status, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const values = [hireId, amount, validTransactionId, status];
    const [result] = await pool.execute(sql, values);

    console.log(`✅ Payment recorded successfully. Payment ID: ${result.insertId}`);
    return result.insertId; // Returns the payment ID
  } catch (error) {
    console.error(`❌ Error in saveHirePaymentDetails() at ${new Date().toISOString()}:`, error.message);
    throw error;
  }
};


const getHireByUserAndCar = async (userId, carId) => {
  try {
    // Validate inputs before querying hire details
    if (!userId || !carId) {
      throw new Error("Missing required fields in hire lookup request.");
    }

    const sql = `SELECT * FROM hires WHERE user_id = ? AND car_id = ? LIMIT 1`;
    const values = [userId, carId];
    const [rows] = await pool.execute(sql, values);

    if (rows.length === 0) {
      console.warn(`⚠ No hire record found for user_id: ${userId}, car_id: ${carId}`);
      return null;
    }

    console.log(`✅ Hire record retrieved successfully:`, rows[0]);
    return rows[0]; // Return hire record object
  } catch (error) {
    console.error(`❌ Error in getHireByUserAndCar() at ${new Date().toISOString()}:`, error.message);
    throw error;
  }
};

const getHireById = async (hireId) => {
    try {
        const [hire] = await pool.execute(
            'SELECT * FROM hires WHERE id = ?',
            [hireId]
        );
        
        if (!hire[0]) {
            console.log(`❌ No hire found with ID: ${hireId}`);
            return null;
        }
        
        console.log(`✅ Successfully retrieved hire with ID: ${hireId}`);
        return hire[0];
    } catch (error) {
        console.error(`❌ Error in getHireById: ${error.message}`);
        throw error;
    }
};

const getHirePayment = async (hireId) => {
    const [payment] = await pool.execute(
        'SELECT * FROM hire_payments WHERE hire_id = ?',
        [hireId]
    );
    return payment[0];
};

const updatePaymentStatus = async (paymentId, status) => {
    await pool.execute(
        'UPDATE hire_payments SET status = ? WHERE id = ?',
        [status, paymentId]
    );
};

const updateCarAvailability = async (carId, available) => {
    await pool.execute(
        'UPDATE cars SET available_for_hire = ? WHERE car_id = ?',
        [available ? 1 : 0, carId]
    );
};

// ✅ Export functions for controllers
module.exports = {
  createHire,
  updateHireStatus,
  saveHirePaymentDetails,
  getHireByUserAndCar,
  getHireById,
  getHirePayment,
  updatePaymentStatus,
  updateCarAvailability
};
