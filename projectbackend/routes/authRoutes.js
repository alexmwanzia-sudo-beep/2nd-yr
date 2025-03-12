const express = require("express");
const { signup, login } = require("../controllers/authController"); // Ensure this path is correct

const router = express.Router();

router.post("/register", signup); // ✅ This should match your function in authController.js
router.post("/login", login);

module.exports = router;


