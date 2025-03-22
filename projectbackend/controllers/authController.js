const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/usermodels");
require("dotenv").config();

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

      // Call createUser to add the user to the database
      createUser(firstname, lastname, email, hashedPassword, (err, result) => {
          if (err) {
              console.error("Error creating user:", err);

              if (err.code === "ER_DUP_ENTRY") {
                  return res.status(400).json({ message: "Email already exists" });
              }

              return res.status(500).json({ message: "Database error" });
          }

          console.log("User created successfully:", result);
          return res.status(201).json({ message: "User registered successfully" });
      });
  } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Server error" });
  }
};



// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login request body:", req.body);

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    findUserByEmail(email, async (err, results) => {
        if (err) {
            console.error("Error finding user:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || "defaultSecret",
                { expiresIn: "1h" }
            );
            console.log("JWT generated successfully");
            res.json({ message: "Login successful", token });
        } catch (error) {
            console.error("Authentication error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
};

module.exports = { signup, login };
