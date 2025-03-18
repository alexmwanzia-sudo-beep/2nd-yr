const db = require("../config/db");

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

// ✅ Add a new car (including owner, service records, without extras)
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
            carData.image_url ?? null,  // image_url
            carData.number_plate ?? null, 
            carData.car_condition ?? null,  // car_condition
            carData.mileage ?? null, 
            carData.previous_owners ?? null, 
            carData.description ?? null, 
            carData.accident_history ?? null, 
            carData.parking_type ?? null, 
            carData.usage_history ?? null, 
            carData.price ?? null, 
            carData.price_negotiable ?? null, 
            carData.available_for_hire ?? null, 
            carData.owner_name ?? null,  // owner_name
            carData.owner_contact ?? null,  // owner_contact
            carData.owner_email ?? null,  // owner_email
            carData.owner_location ?? null,  // owner_location
            carData.ownership_duration ?? null,  // ownership_duration
            carData.reason_for_selling ?? null,  // reason_for_selling
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

module.exports = { checkUserExists, addCar };

