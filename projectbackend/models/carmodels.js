/*const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL Database");
    connection.release();
  } catch (error) {
    console.error(" MySQL Connection Error:", error);
  }
};

module.exports = { pool, connectDB };*/
const db = require("../config/db");

const addCar = async (carData) => {
    const query = `INSERT INTO cars (user_id, make, model, year, image, numberplate, 
        car_condition, mileage, previous_owners, description, accident_history, 
        parking_type, usage_history, price, price_negotiable, available_for_hire) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
        carData.userId, carData.make, carData.model, carData.year, carData.image, 
        carData.numberplate, carData.condition, carData.mileage, carData.previousOwners, 
        carData.description, carData.accidentHistory, carData.parkingType, 
        carData.usageHistory, carData.priceCents, carData.priceNegotiable, 
        carData.availableforhire
    ];

    const [result] = await db.pool.execute(query, values);
    return result.insertId;
};
 const addowner=async(carId, ownerData)=>{
  const query = `INSERT INTO car_owners (car_id, name, contact_number, email, 
  location, ownership_duration, reason_for_selling) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`
  const values=[
    carId, ownerData.name, ownerData.contactNumber, ownerData.email, 
    ownerData.location, ownerData.ownershipDuration, ownerData.reasonForSelling
];
await db.pool.execute(query,values)
 }

 const addServiceRecords= async (carId,serviceRecords)=>{
  const query=`INSERT INTO car_service_records (car_id, service_date, service_details) 
    VALUES (?, ?, ?)`;
    for (let record of serviceRecords) {
      await db.pool.execute(query, [carId, record.date, record.service]);
  }
 }

module.exports = { addCar,addowner,addServiceRecords};
