const { pool } = require("../config/db");

// ✅ Function to check if an email already exists
const checkEmailExists = async (email) => {
    try {
        const sql = "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";
        console.log("Checking if email exists with query:", sql, "and email:", email);

        const [result] = await pool.execute(sql, [email]);

        // If emailCount > 0, the email already exists
        return result[0].emailCount > 0;
    } catch (error) {
        console.error("❌ Error checking email existence:", error);
        throw error;
    }
};

// ✅ Function to create a new user in the database
const createUser = async (firstname, lastname, email, hashedPassword) => {
    try {
        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            throw new Error("Email already exists");
        }

        const sql = "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
        const values = [firstname, lastname, email, hashedPassword];
        console.log("Executing user creation query with values:", values);

        // Execute the insertion query
        const [result] = await pool.execute(sql, values);

        console.log("User created successfully in the database with ID:", result.insertId);
        return result.insertId; // Return the newly created user's ID
    } catch (error) {
        console.error("❌ Error creating user:", error);
        throw error;
    }
};

// ✅ Function to find a user by email
const findUserByEmail = async (email) => {
    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        console.log("Executing query to find user by email:", sql, "with email:", email);

        const [results] = await pool.execute(sql, [email]);

        console.log("Query results for findUserByEmail:", results);
        return results; // Return the user data (empty array if not found)
    } catch (error) {
        console.error("❌ Error finding user by email:", error);
        throw error;
    }
};

// ✅ New Functions: Get User by ID and Get User Cars
const db = require("../config/db");

const getUserById = async (userId) => {
    try {
      const sql = "SELECT * FROM users WHERE id = ?";
      console.log("Executing query to get user by ID:", sql, "with userId:", userId);
  
      // Use pool.execute to query the database
      const [results] = await pool.execute(sql, [userId]);
  
      console.log("Query results for getUserById:", results);
      return results[0]; // Return the first user object (assuming userId is unique)
    } catch (error) {
      console.error("❌ Error fetching user by ID:", error);
      throw error;
    }
  };

  const getUserCars = async (userId) => {
    try {
      const sql = "SELECT * FROM cars WHERE user_id = ?";
      console.log("Executing query to get user cars:", sql, "with userId:", userId);
  
      // Use pool.execute to query the database
      const [results] = await pool.execute(sql, [userId]);
  
      console.log("Query results for getUserCars:", results);
      return results; // Return the array of cars (empty if none found)
    } catch (error) {
      console.error("❌ Error fetching cars by user ID:", error);
      throw error;
    }

  }

// Get cars that user can review (hired or reserved)
const getReviewableCars = async (userId) => {
    try {
        // First, get all hired and reserved cars in a single query
        const query = `
            SELECT DISTINCT 
                c.*,
                CASE 
                    WHEN h.id IS NOT NULL THEN 'Hired'
                    WHEN r.id IS NOT NULL THEN 'Reserved'
                END as status
            FROM cars c
            LEFT JOIN (
                SELECT DISTINCT car_id, id 
                FROM hires 
                WHERE user_id = ?
            ) h ON c.car_id = h.car_id
            LEFT JOIN (
                SELECT DISTINCT car_id, id 
                FROM reservations 
                WHERE user_id = ?
            ) r ON c.car_id = r.car_id
            WHERE h.id IS NOT NULL OR r.id IS NOT NULL
            ORDER BY c.make, c.model;
        `;
        
        const [cars] = await pool.execute(query, [userId, userId]);
        
        // Log the results for debugging
        console.log(`Found ${cars.length} reviewable cars for user ${userId}`);
        console.log('Cars:', JSON.stringify(cars, null, 2));
        
        return cars;
    } catch (error) {
        console.error('Error getting reviewable cars:', error);
        throw error;
    }
};

// Get user's reviews
const getUserReviews = async (userId) => {
    try {
        const query = `
            SELECT 
                r.*,
                c.make,
                c.model,
                c.year
            FROM reviews r
            LEFT JOIN cars c ON r.car_id = c.car_id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `;
        const [reviews] = await pool.execute(query, [userId]);
        return reviews;
    } catch (error) {
        console.error('Error getting user reviews:', error);
        throw error;
    }
};

// ✅ Export all functions
module.exports = {
    checkEmailExists,
    createUser,
    findUserByEmail,
    getUserById,
    getUserCars,
    getReviewableCars,
    getUserReviews
};
