// Import necessary functions
const { addCar, checkUserExists, getAllCars, getUserCars } = require("../models/carmodels"); 
const path = require("path");

// ✅ Function to format image paths
const formatImagePath = (filePath) => {
    if (!filePath) return "/uploads/default-image.jpg"; // Fallback if no image

    // Normalize file path: Replace backslashes with forward slashes for consistency
    return filePath.replace(/\\/g, "/").replace(/^.*[\\\/]uploads[\\\/]/, "/uploads/");
};

// ✅ Controller function to fetch all cars
const getCars = async (req, res) => {
    try {
        // Fetch all cars from the model
        const cars = await getAllCars();

        // Format image paths for consistency
        const formattedCars = cars.map(car => ({
            ...car,
            image_url: formatImagePath(car.image_url)
        }));

        res.status(200).json(formattedCars); // Send formatted car data
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

        // ✅ Fix: Normalize file path correctly
        const imagePath = formatImagePath(path.relative(__dirname, req.file.path));

        // Prepare car data for the database
        const carData = {
            userId,
            make,
            model,
            year,
            image_url: imagePath, // Assign formatted image path
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

// ✅ Controller function to fetch user's listed cars
const getListedCars = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('Fetching listed cars for user:', userId);
        
        // Debug: Check if getUserCars is a function
        console.log('getUserCars type:', typeof getUserCars);
        console.log('getUserCars:', getUserCars);
        
        if (typeof getUserCars !== 'function') {
            throw new Error('getUserCars is not a function. It is: ' + typeof getUserCars);
        }
        
        const cars = await getUserCars(userId);
        console.log(`Found ${cars.length} cars for user ${userId}`);

        res.status(200).json(cars);
    } catch (error) {
        console.error("❌ Error in getListedCars controller:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch listed cars",
            error: error.message 
        });
    }
};

// ✅ Export controller functions
module.exports = {
    getCars,
    createCar,
    getListedCars
};
