const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Configure the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Car Hire Request Route (Enforce 10-day Rule)
app.post('/hire', (req, res) => {
  const { fullName, email, phone, idNumber, license, carId, startDate, endDate, duration } = req.body;

  if (duration < 10) {
    return res.status(400).json({ message: "You must hire the car for at least 10 days." });
  }

  // Check if car is available
  const availabilityQuery = `
    SELECT * FROM car_hires 
    WHERE car_id = ? 
    AND ((start_date <= ? AND end_date >= ?) OR (start_date >= ? AND start_date <= ?))
  `;

  db.query(availabilityQuery, [carId, endDate, startDate, startDate, endDate], (err, results) => {
    if (err) {
      console.error('Error checking availability:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Car is already taken. Try another one." });
    }

    // Insert hire request
    const query = `
      INSERT INTO car_hires (full_name, email, phone, id_number, license, car_id, start_date, end_date, duration, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    db.query(query, [fullName, email, phone, idNumber, license, carId, startDate, endDate, duration], (err, result) => {
      if (err) {
        console.error('Error inserting hire request:', err);
        return res.status(500).send('Internal Server Error');
      }

      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Car Hire Confirmation',
        text: `Dear ${fullName},\n\nYour car hire request for car ID ${carId} from ${startDate} to ${endDate} has been received.\n\nThank you for choosing our service!` 
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      return res.status(201).send('Car hire request submitted successfully.');
    });
  });
});

// Check if User is Eligible to Buy
app.get('/checkHire', (req, res) => {
  const { user_id, car_id } = req.query;

  const query = "SELECT end_date FROM car_hires WHERE car_id = ? AND duration >= 10 ORDER BY end_date DESC LIMIT 1";
  db.query(query, [car_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error checking hire history" });

    if (result.length === 0) {
      return res.json({ eligible: false }); // User hasn't hired for 10+ days
    }

    const hireEnd = new Date(result[0].end_date);
    const today = new Date();

    if (today >= hireEnd) {
      res.json({ eligible: true }); // User can buy
    } else {
      res.json({ eligible: false }); // Not yet eligible
    }
  });
});



app.post('/buy',(req,res)=>{
  const { fullName, phone, address, kraPin, carId, price } = req.body;

  const query =`INSERT INTO car_purchases (full_name, phone, address, kra_pin, car_id, price, status, purchase_date)VALUES(?,?,?,?,?,?,'pending',NOW())`
  db.query(query,[fullName, phone, address, kraPin, carId, price],(err, result)=>{
    if(err){
      console.error('error insrting purchase:', err)
      return res.status(500).send('internal server error')
    }
//send confirmation email
const mailOptions ={
  from:process.env.EMAIL_USER,
  to:process.env.ADMIN_EMAIL,
  subject:'New car Purchase request',
  text:`New purchase request: ${fullName} wants to buy car ID ${carId} for ${price}.`
};

transporter.sendMail(mailOptions,(error,info)=>{
  if(error){
    console.error('error sending mail:',error)
  }else{
    console.log('email sent')
  }
});

return res.status(201).json({message:`purchase request submitted  successfully`});
  })
})

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
