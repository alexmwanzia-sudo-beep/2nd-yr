const { db } = require('../config/db');
const transporter = require('../config/email');

exports.hireCar = (req, res) => {
  const { fullName, email, phone, idNumber, license, carId, startDate, endDate, duration } = req.body;

  if (duration < 10) {
    return res.status(400).json({ message: "You must hire the car for at least 10 days." });
  }

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

    const insertQuery = `
      INSERT INTO car_hires (full_name, email, phone, id_number, license, car_id, start_date, end_date, duration, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    db.query(insertQuery, [fullName, email, phone, idNumber, license, carId, startDate, endDate, duration], (err, result) => {
      if (err) {
        console.error('Error inserting hire request:', err);
        return res.status(500).send('Internal Server Error');
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Car Hire Confirmation',
        text: `Dear ${fullName},\n\nYour car hire request for car ID ${carId} from ${startDate} to ${endDate} has been received.\n\nThank you for choosing our service!`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error('Error sending email:', error);
      });

      return res.status(201).send('Car hire request submitted successfully.');
    });
  });
};

exports.checkHireStatus = (req, res) => {
  const { car_id } = req.query;

  const query = "SELECT end_date FROM car_hires WHERE car_id = ? AND duration >= 10 ORDER BY end_date DESC LIMIT 1";
  
  db.query(query, [car_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error checking hire history" });

    if (result.length === 0) {
      return res.json({ eligible: false });
    }

    const hireEnd = new Date(result[0].end_date);
    const today = new Date();

    res.json({ eligible: today >= hireEnd });
  });
};

exports.buyCar = (req, res) => {
  const { fullName, phone, address, kraPin, carId, price } = req.body;

  const query = `INSERT INTO car_purchases (full_name, phone, address, kra_pin, car_id, price, status, purchase_date) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`;

  db.query(query, [fullName, phone, address, kraPin, carId, price], (err, result) => {
    if (err) {
      console.error('Error inserting purchase:', err);
      return res.status(500).send('Internal Server Error');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Car Purchase Request',
      text: `New purchase request: ${fullName} wants to buy car ID ${carId} for ${price}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error('Error sending email:', error);
    });

    return res.status(201).json({ message: `Purchase request submitted successfully.` });
  });
};
