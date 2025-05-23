const { pool } = require("../config/db");

// Create a new sale record
const createSale = async (carId, sellerId, buyerId, amount) => {
  try {
    const sql = `
      INSERT INTO sales (car_id, seller_id, buyer_id, amount, sale_date)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(sql, [carId, sellerId, buyerId, amount]);
    return result.insertId;
  } catch (error) {
    console.error("❌ Error creating sale:", error);
    throw error;
  }
};

// Get car owner's ID
const getCarOwner = async (carId) => {
  try {
    const sql = "SELECT user_id FROM cars WHERE car_id = ?";
    const [results] = await pool.execute(sql, [carId]);
    return results[0]?.user_id;
  } catch (error) {
    console.error("❌ Error getting car owner:", error);
    throw error;
  }
};

// Remove car from the system
const removeCar = async (carId) => {
  try {
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // First, get all reservations for this car
      const [reservations] = await connection.execute(
        'SELECT id FROM reservations WHERE car_id = ?',
        [carId]
      );

      // If there are reservations, get their IDs
      const reservationIds = reservations.map(r => r.id);

      // Delete payments first if there are any reservations
      if (reservationIds.length > 0) {
        // Create a comma-separated list of IDs for SQL IN clause
        const idsString = reservationIds.join(',');
        // Delete payments
        await connection.execute(
          `DELETE FROM payments WHERE reservation_id IN (${idsString})`
        );
      }

      // Delete reservations next
      await connection.execute(
        'DELETE FROM reservations WHERE car_id = ?',
        [carId]
      );

      // Finally delete the car
      const [result] = await connection.execute(
        'DELETE FROM cars WHERE car_id = ?',
        [carId]
      );

      // Commit the transaction
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      // If there's an error, rollback the transaction
      await connection.rollback();
      console.error("❌ Error in removeCar transaction:", error);
      throw error;
    } finally {
      // Always release the connection
      connection.release();
    }
  } catch (error) {
    console.error("❌ Error removing car:", error);
    throw error;
  }
};

// Get all reservations for a car
const getCarReservations = async (carId) => {
  try {
    const sql = `
      SELECT r.*, u.email, u.firstname, u.lastname
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      WHERE r.car_id = ?
    `;
    const [results] = await pool.execute(sql, [carId]);
    return results;
  } catch (error) {
    console.error("❌ Error getting car reservations:", error);
    throw error;
  }
};

module.exports = {
  createSale,
  getCarOwner,
  removeCar,
  getCarReservations
}; 