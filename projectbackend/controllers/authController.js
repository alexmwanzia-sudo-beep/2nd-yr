const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/usermodels");
require("dotenv").config();

// Signup Controller
const signup = async (req, res) => {
    console.log("Received signup request");

    const { firstname, lastname, email, password } = req.body;

    // Input validation
    if (!firstname || !lastname || !email || !password) {
        console.log("Validation failed: Missing required fields");
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash the password
        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully:", hashedPassword);

        // Create the user in the database
        const userId = await createUser(firstname, lastname, email, hashedPassword);
        console.log("User created successfully with ID:", userId);

        return res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
        console.error("Error during signup:", error);

        if (error.message === "Email already exists") {
            return res.status(400).json({ message: "Email already exists" });
        }

        return res.status(500).json({ message: "Server error" });
    }
};

// Login Controller
const login = async (req, res) => {
    console.log("Received login request");

    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        console.log("Validation failed: Missing email or password");
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find the user by email
        const results = await findUserByEmail(email);
        console.log("User lookup results:", results);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || "defaultSecret",
            { expiresIn: "1h" }
        );

        console.log("JWT generated successfully");
        return res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { signup, login };
