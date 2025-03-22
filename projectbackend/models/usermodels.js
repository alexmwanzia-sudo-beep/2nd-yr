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

module.exports = { checkEmailExists, createUser, findUserByEmail };
