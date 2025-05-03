const db = require("../config/db"); // Database connection

// ✅ Check if a user exists by userId
const checkUserExists = async (userId) => {
    try {
        const query = `SELECT COUNT(*) AS userCount FROM users WHERE id = ?`;
        const [result] = await db.pool.execute(query, [userId]);

        // If the user count is greater than 0, then the user exists
        return result[0].userCount > 0;
    } catch (error) {
        console.error("❌ Error checking user existence:", error);
        throw error;
    }
};

// ✅ Fetch all cars from the database
const getAllCars = async () => {
    try {
        const query = `SELECT * FROM cars`;
        const [cars] = await db.pool.execute(query);

        // Map through cars and adjust the image_url if necessary
        const formattedCars = cars.map(car => ({
            ...car,
            image_url: car.image_url?.replace(/^\/?uploads\//, '') || null, // Strip "/uploads/" and handle null values
        }));

        return formattedCars;
    } catch (error) {
        console.error("❌ Error fetching cars:", error);
        throw error;
    }
};

// ✅ Add a new car to the database
const addCar = async (carData) => {
    try {
        // First, check if the user exists before adding the car
        const userExists = await checkUserExists(carData.userId);
        if (!userExists) {
            throw new Error("User ID does not exist");
        }

        const query = `
            INSERT INTO cars (
                user_id, make, model, year, image_url, number_plate, car_condition, mileage, 
                previous_owners, description, accident_history, parking_type, usage_history, 
                price, price_negotiable, available_for_hire, owner_name, owner_contact, 
                owner_email, owner_location, ownership_duration, reason_for_selling, service_date, 
                service_details
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            carData.userId ?? null, 
            carData.make ?? null, 
            carData.model ?? null, 
            carData.year ?? null, 
            carData.image_url ? carData.image_url.replace(/^\/?uploads\//, '') : null, // Fix image_url here as well
            carData.number_plate ?? null, 
            carData.car_condition ?? null, 
            carData.mileage ?? null, 
            carData.previous_owners ?? null, 
            carData.description ?? null, 
            carData.accident_history ?? null, 
            carData.parking_type ?? null, 
            carData.usage_history ?? null, 
            carData.price ?? null, 
            carData.price_negotiable ?? null, 
            carData.available_for_hire ?? null, 
            carData.owner_name ?? null, 
            carData.owner_contact ?? null, 
            carData.owner_email ?? null, 
            carData.owner_location ?? null, 
            carData.ownership_duration ?? null, 
            carData.reason_for_selling ?? null, 
            carData.service_date ?? null, 
            carData.service_details ?? null
        ];

        const [result] = await db.pool.execute(query, values);
        return result.insertId;
    } catch (error) {
        console.error("❌ Error adding car:", error);
        throw error;
    }
};

// ✅ Get cars owned by a specific user
const getUserCars = async (userId) => {
    try {
        const query = `SELECT * FROM cars WHERE user_id = ?`;
        const [cars] = await db.pool.execute(query, [userId]);

        // Map through cars and adjust the image_url if necessary
        const formattedCars = cars.map(car => ({
            ...car,
            image_url: car.image_url?.replace(/^\/?uploads\//, '') || null, // Strip "/uploads/" and handle null values
        }));

        return formattedCars;
    } catch (error) {
        console.error("❌ Error fetching user's cars:", error);
        throw error;
    }
};

module.exports = { checkUserExists, getAllCars, addCar, getUserCars };
