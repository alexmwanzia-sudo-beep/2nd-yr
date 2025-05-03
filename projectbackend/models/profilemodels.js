const { pool } = require('../config/db');

/**
 * Get user profile by user ID
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} - The user profile data
 */
const getUserProfile = async (userId) => {
  try {
    // Get user data from users table
    const [userRows] = await pool.execute(
      'SELECT id, firstname, lastname, email  FROM users WHERE id = ?',
      [userId]
    );
    
    if (!userRows || userRows.length === 0) {
      return null;
    }
    
    // Return user data with default profile image
    return {
      ...userRows[0],
      profile_picture: '/user-profile/default-profile.jpg' // Updated default profile image path
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

/**
 * Get user's owned cars
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of cars owned by the user
 */
const getUserCars = async (userId) => {
  try {
    // Modified query to include all reservations
    const [rows] = await pool.execute(
      `SELECT c.*, 
              COUNT(DISTINCT r.id) as reservation_count,
              GROUP_CONCAT(DISTINCT CONCAT(u.firstname, ' ', u.lastname, ' (', r.status, ')')) as interested_buyers
       FROM cars c
       LEFT JOIN reservations r ON c.car_id = r.car_id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE c.user_id = ?
       GROUP BY c.car_id`,
      [userId]
    );
    
    // Update image paths and format the data
    return rows.map(car => ({
      ...car,
      image_url: car.image_url ? `/uploads/${car.image_url}` : '/cars2/car3.jpg',
      interested_buyers: car.interested_buyers ? car.interested_buyers.split(',') : [],
      has_interested_buyers: car.reservation_count > 0,
      reservation_count: car.reservation_count
    }));
  } catch (error) {
    console.error('Error in getUserCars:', error);
    // If there's an error, return an empty array instead of throwing
    return [];
  }
};

/**
 * Get user's hire history
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of hire records
 */
const getUserHireHistory = async (userId) => {
  try {
    // First, let's check the structure of the hires table
    const [hireRows] = await pool.execute(
      `SELECT h.*, c.make, c.model, c.year, c.image_url, c.price, c.mileage, c.car_condition, c.description, c.owner_name, c.owner_contact
       FROM hires h
       LEFT JOIN cars c ON h.car_id = c.car_id
       WHERE h.user_id = ?`,
      [userId]
    );
    
    if (!hireRows || hireRows.length === 0) {
      return []; // Return empty array if no hires found
    }
    
    // Format the data
    const hireHistory = hireRows.map(hire => {
      // Calculate end_date based on start_date and duration
      const startDate = new Date(hire.start_date);
      const durationDays = parseInt(hire.duration) || 1; // Default to 1 day if duration is missing
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + durationDays);
      
      return {
        ...hire,
        end_date: endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        car: {
          car_id: hire.car_id,
          make: hire.make || 'Unknown',
          model: hire.model || 'Unknown',
          year: hire.year || 'Unknown',
          image_url: hire.image_url ? `/uploads/${hire.image_url}` : '/cars2/car3.jpg',
          price: hire.price,
          mileage: hire.mileage,
          car_condition: hire.car_condition,
          description: hire.description,
          owner_name: hire.owner_name,
          owner_contact: hire.owner_contact
        }
      };
    });
    
    return hireHistory;
  } catch (error) {
    console.error('Error in getUserHireHistory:', error);
    return []; // Return empty array on error
  }
};

/**
 * Get user's reservation history
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of reservation records
 */
const getUserReservationHistory = async (userId) => {
  try {
    const [reservationRows] = await pool.execute(
      `SELECT r.*, c.make, c.model, c.year, c.image_url, c.price, c.mileage, c.car_condition, c.description, c.owner_name, c.owner_contact
       FROM reservations r
       LEFT JOIN cars c ON r.car_id = c.car_id
       WHERE r.user_id = ?`,
      [userId]
    );
    
    if (!reservationRows || reservationRows.length === 0) {
      return []; // Return empty array if no reservations found
    }
    
    const reservationHistory = reservationRows.map(reservation => ({
      ...reservation,
      car: {
        car_id: reservation.car_id,
        make: reservation.make || 'Unknown',
        model: reservation.model || 'Unknown',
        year: reservation.year || 'Unknown',
        image_url: reservation.image_url ? `/uploads/${reservation.image_url}` : '/cars2/car3.jpg',
        price: reservation.price,
        mileage: reservation.mileage,
        car_condition: reservation.car_condition,
        description: reservation.description,
        owner_name: reservation.owner_name,
        owner_contact: reservation.owner_contact // Ensure this is mapped correctly
      }
    }));
    
    return reservationHistory;
  } catch (error) {
    console.error('Error in getUserReservationHistory:', error);
    return [];
  }
};

/**
 * Update user profile picture
 * @param {number} userId - The ID of the user
 * @param {string} profilePicture - The URL or path to the profile picture
 * @returns {Promise<boolean>} - Whether the update was successful
 */
const updateProfilePicture = async (userId, profilePicture) => {
  try {
    // For now, just return true as we're not actually updating the database
    // In a real implementation, you would update the user's profile picture in the database
    return true;
  } catch (error) {
    console.error('Error in updateProfilePicture:', error);
    throw error;
  }
};

/**
 * Save user profile data
 * @param {Object} profileData - The profile data to save
 * @returns {Promise<Object>} - The saved profile data
 */
const saveUserProfile = async (profileData) => {
  try {
    // For now, just return the profile data as we're not actually updating the database
    // In a real implementation, you would update the user's profile in the database
    return profileData;
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    throw error;
  }
};

/**
 * Get user notifications
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of notifications
 */
const getUserNotifications = async (userId) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    return rows;
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    return []; // Return empty array on error
  }
};

module.exports = {
  getUserProfile,
  getUserCars,
  getUserHireHistory,
  getUserReservationHistory,
  updateProfilePicture,
  saveUserProfile,
  getUserNotifications
};