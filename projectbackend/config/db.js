require("dotenv").config();
const mysql = require("mysql2");

// Create a connection pool with Promises
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ale@2030##",
  database: "carsserver",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0
});

// Convert pool to use Promises
const promisePool = pool.promise();

// Function to test connection
const connectDB = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log("✅ Connected to MySQL Database");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("❌ Error connecting to MySQL:", err);
  }
};

module.exports = { pool: promisePool, connectDB };

