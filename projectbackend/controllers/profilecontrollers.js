const { getUserById, getUserCars } = require("../models/usermodels");

const getProfileData = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await getUserById(userId);
        const cars = await getUserCars(userId);

        res.json({ user: user[0], cars });
    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getProfileData };
