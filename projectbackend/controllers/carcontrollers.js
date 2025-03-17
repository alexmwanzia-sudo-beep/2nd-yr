const { addCar, checkUserExists } = require("../models/carmodels"); // Import both addCar and checkUserExists
const fs = require('fs');
const path = require('path');

const createCar = async (req, res) => {
    try {
        const {
            userId, make, model, year, numberplate, car_condition, mileage,
            previous_owners, description, accident_history, parking_type, usage_history,
            price, price_negotiable, available_for_hire, owner_name, owner_contact, 
            owner_email, owner_location, ownership_duration, reason_for_selling, 
            service_date, service_details
        } = req.body;

        // Check if the user exists
        const userExists = await checkUserExists(userId);

        if (!userExists) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const imagePath = `/uploads/${req.file.filename}`; // Save file path

        // Prepare car data to insert into the database
        const carData = {
            userId,
            make,
            model,
            year,
            image_url: imagePath, // Image path
            number_plate: numberplate,
            car_condition, // Using car_condition from req.body
            mileage, // Using mileage from req.body
            previous_owners, // Using previous_owners from req.body
            description, // Using description from req.body
            accident_history, // Using accident_history from req.body
            parking_type, // Using parking_type from req.body
            usage_history, // Using usage_history from req.body
            price, // Using price from req.body
            price_negotiable, // Using price_negotiable from req.body
            available_for_hire, // Using available_for_hire from req.body
            owner_name, // Using owner_name from req.body
            owner_contact, // Using owner_contact from req.body
            owner_email, // Using owner_email from req.body
            owner_location, // Using owner_location from req.body
            ownership_duration, // Using ownership_duration from req.body
            reason_for_selling, // Using reason_for_selling from req.body
            service_date, // Using service_date from req.body
            service_details, // Using service_details from req.body
        };

        // Insert car data into the database
        const carId = await addCar(carData);

        res.status(201).json({ message: "Car added successfully", carId });
    } catch (error) {
        console.error("Error adding car:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = { createCar };
