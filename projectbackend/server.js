const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes"); 
const carRoutes = require("./routes/car-routes"); // Add car routes

const app = express();

// ✅ Serve static files correctly
app.use("/uploads", express.static('uploads'));

app.use(cors());
app.use(express.json()); 

connectDB(); 

// ✅ Register routes
app.use("/api/auth", authRoutes); // Better API structuring
app.use("/api/cars", carRoutes); // Add car routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port ${PORT}"));