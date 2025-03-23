const { addCar, checkUserExists, getAllCars } = require("../models/carmodels"); // Import model functions

// ✅ Controller function to fetch all cars
const getCars = async (req, res) => {
    try {
        // Fetch all cars from the model
        const cars = await getAllCars();
        res.status(200).json(cars); // Send car data as JSON response
    } catch (error) {
        console.error("❌ Error in getCars controller:", error);
        res.status(500).json({ message: "Failed to fetch car data." });
    }
};

// ✅ Controller function to add a new car
const createCar = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
            userId, make, model, year, number_plate, car_condition, mileage,
            previous_owners, description, accident_history, parking_type, usage_history,
            price, price_negotiable, available_for_hire, owner_name, owner_contact, 
            owner_email, owner_location, ownership_duration, reason_for_selling, 
            service_date, service_details
        } = req.body;

        // Debugging: Log request body and file
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        // Check if the user exists
        const userExists = await checkUserExists(userId);
        if (!userExists) {
            return res.status(400).json({ message: "User does not exist." });
        }

        // Validate if an image file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image." });
        }

        // Construct the image file path
        const imagePath = req.file.path.replace(/^\/?uploads\//, ''); // Ensure clean path

        // Prepare car data for the database
        const carData = {
            userId,
            make,
            model,
            year,
            image_url: imagePath, // Assign the cleaned-up image path
            number_plate,
            car_condition,
            mileage,
            previous_owners,
            description,
            accident_history,
            parking_type,
            usage_history,
            price,
            price_negotiable,
            available_for_hire,
            owner_name,
            owner_contact,
            owner_email,
            owner_location,
            ownership_duration,
            reason_for_selling,
            service_date,
            service_details,
        };

        // Add the car to the database
        const carId = await addCar(carData);

        // Respond with a success message
        res.status(201).json({ message: "Car added successfully.", carId });
    } catch (error) {
        console.error("❌ Error in createCar controller:", error);

        // Send an error response
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// ✅ Export controller functions
module.exports = { getCars, createCar };
