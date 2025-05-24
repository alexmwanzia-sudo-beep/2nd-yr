const { pool } = require("../config/db");

// ✅ Add a car to favorites
const addFavorite = async (userId, carId) => {
    try {
        console.log(`Adding favorite for user ${userId} and car ${carId}`);
        
        // Check if car exists
        const [car] = await pool.execute('SELECT car_id FROM cars WHERE car_id = ?', [carId]);
        if (!car[0]) {
            throw new Error('Car does not exist');
        }

        // Check if already favorited
        const [existing] = await pool.execute('SELECT * FROM favorites WHERE user_id = ? AND car_id = ?', [userId, carId]);
        if (existing[0]) {
            console.log('Car is already in favorites');
            return { affectedRows: 0 };
        }

        // Add to favorites
        const [result] = await pool.execute(
            'INSERT INTO favorites (user_id, car_id) VALUES (?, ?)',
            [userId, carId]
        );

        console.log('Favorite added successfully:', result);
        return result;
    } catch (error) {
        console.error("❌ Error adding favorite:", error);
        throw error;
    }
};

// ✅ Get user's favorites
const getFavorites = async (userId) => {
    try {
        console.log(`Fetching favorites for user ${userId}`);
        
        const [favorites] = await pool.execute(
            `SELECT 
                c.car_id, 
                c.make, 
                c.model, 
                c.year, 
                c.price,
                c.mileage,
                c.car_condition,
                c.description,
                c.image_url,
                c.owner_name,
                c.owner_contact
            FROM favorites f
            JOIN cars c ON f.car_id = c.car_id
            WHERE f.user_id = ?`,
            [userId]
        );
        
        console.log(`Retrieved ${favorites.length} favorites`);
        return favorites;
    } catch (error) {
        console.error("❌ Error fetching favorites:", error);
        throw error;
    }
};

// ✅ Remove a car from the user's favorites
const removeFavorite = async (userId, carId) => {
    try {
        const [result] = await pool.execute(
            "DELETE FROM favorites WHERE user_id = ? AND car_id = ?",
            [userId, carId]
        );
        return result.affectedRows;
    } catch (error) {
        console.error("❌ Error removing favorite:", error);
        throw error;
    }
};

// ✅ Check if a car is in the user's favorites
const checkFavorite = async (userId, carId) => {
    try {
        const [favorites] = await pool.execute(
            "SELECT * FROM favorites WHERE user_id = ? AND car_id = ?",
            [userId, carId]
        );
        return favorites.length > 0;
    } catch (error) {
        console.error("❌ Error checking favorite:", error);
        throw error;
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite,
    checkFavorite
};