
require("dotenv").config();
const mysql = require("mysql2");


const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ale@2030##",
  database:"carsserver",
  port:3306
  //waitForConnections: true,
  //connectionLimit: 10,  // Adjust as needed
  //queueLimit: 0
});

const connectDB = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(" Error connecting to MySQL:", err);
      return;
    }
    console.log("✅ Connected to MySQL Database");
    connection.release(); // Release the connection back to the pool
  });
};

module.exports = { pool, connectDB };
