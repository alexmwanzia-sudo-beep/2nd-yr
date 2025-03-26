const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/car-routes');
const profileRoutes = require('./routes/profileroutes'); // Import profileRoutes

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log HTTP requests

// Serve static files from the correct 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files from frontend
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve uploaded files

// Database connection
connectDB();

// Routes
app.use('/api', authRoutes); // Authentication routes
app.use('/api/cars', carRoutes); // Car-related routes
app.use('/api/profile', profileRoutes); // User profile routes

// Route for home page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'home.html')); // Serve the home page
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
