const { pool } = require("../config/db");

// Function to create a new user in the database
const createUser = (firstname, lastname, email, hashedPassword, callback) => {
  const sql = "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
  console.log("Executing query with values:", [firstname, lastname, email, hashedPassword]);

  pool.query(sql, [firstname, lastname, email, hashedPassword], (err, result) => {
      if (err) {
          console.error("Error during query execution:", err);
          return callback(err, null); // Pass error back to the controller
      }
      console.log("User created successfully in the database:", result);
      callback(null, result); // Pass the result back to the controller
  });
};

// Function to find a user by email
const findUserByEmail = (email) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  console.log("Executing query:", sql, "with email:", email);

  return new Promise((resolve, reject) => {
      pool.query(sql, [email], (err, results) => {
          if (err) {
              console.error("Database error in findUserByEmail:", err);
              return reject(err); // Pass the error to the caller
          }
          console.log("Query results in findUserByEmail:", results);
          resolve(results || []); // Always return a valid array
      });
  });
};


module.exports = { createUser, findUserByEmail };
