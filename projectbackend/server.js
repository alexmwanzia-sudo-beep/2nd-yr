const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/car-routes');
const profileRoutes = require('./routes/profileroutes'); // User profile routes
const purchaseRoutes = require('./routes/purchaseroutes'); // Purchase-related routes
//const reservationRoutes = require('./routes/reservationRoutes'); // New reservation routes
const hireRoutes = require('./routes/hireroutes'); // Hire-related routes

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log HTTP requests

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files from frontend folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve uploaded files

// Database connection
connectDB();

// Routes
app.use('/api', authRoutes); // Authentication routes
app.use('/api/cars', carRoutes); // Car-related routes
app.use('/api/profile', profileRoutes); // User profile routes
app.use('/api/purchase', purchaseRoutes); // Purchase-related routes
app.use('/api/hire',hireRoutes); // Hire-related routes

//app.use('/api/reservation', reservationRoutes); // New reservation routes

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
