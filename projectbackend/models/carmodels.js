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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
    `;
    
    const values = [
        carData.userId ?? null, 
        carData.make ?? null, 
        carData.model ?? null, 
        carData.year ?? null, 
        carData.image ?? null,  // image_url
        carData.numberplate ?? null, 
        carData.condition ?? null,  // car_condition
        carData.mileage ?? null, 
        carData.previousOwners ?? null, 
        carData.description ?? null, 
        carData.accidentHistory ?? null, 
        carData.parkingType ?? null, 
        carData.usageHistory ?? null, 
        carData.price ?? null, 
        carData.priceNegotiable ?? null, 
        carData.availableForHire ?? null, 
        carData.currentOwner?.name ?? null,  // owner_name
        carData.currentOwner?.contact ?? null,  // owner_contact
        carData.currentOwner?.email ?? null,  // owner_email
        carData.currentOwner?.location ?? null,  // owner_location
        carData.currentOwner?.ownershipDuration ?? null,  // ownership_duration
        carData.currentOwner?.reasonForSelling ?? null,  // reason_for_selling
        carData.serviceDate ?? null, 
        carData.serviceDetails ?? null
    ];

        
        

        const [result] = await db.pool.execute(query, values);
        return result.insertId;
    } catch (error) {
        console.error("❌ Error adding car:", error);
        throw error;
    }
};

module.exports = { checkUserExists, addCar };

