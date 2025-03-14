const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/usermodels");
require("dotenv").config();

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  findUserByEmail(email, async (err, results) => {
    if (err) {
      console.error("Database Error (findUserByEmail):", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      createUser(firstName, lastName, email, hashedPassword, (err, result) => {
        if (err) {
          console.error("Database Error (createUser):", err);
          return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully" });
      });
    } catch (error) {
      console.error("Hashing Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
};


const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  findUserByEmail(email, async (err, results) => {
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email },"mySuperSecretKey123!", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  });
};

module.exports = { signup, login };
