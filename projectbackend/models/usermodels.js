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
// ✅ Export all functions
module.exports = {
    checkEmailExists,
    createUser,
    findUserByEmail,
    getUserById,
    getUserCars,
};
