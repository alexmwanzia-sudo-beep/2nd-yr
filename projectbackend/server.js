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
const saleRoutes = require('./routes/saleroutes');
//const reservationRoutes = require('./routes/reservationRoutes'); // New reservation routes
const hireRoutes = require('./routes/hireroutes'); // Hire-related routes
const userRoutes = require('./routes/userroutes');
const reviewRoutes = require('./routes/reviewroutes'); // Review routes

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
app.use('/api/sales', saleRoutes);
app.use('/api/hire', hireRoutes); // Hire-related routes
app.use('/api/user', userRoutes);
app.use('/api/reviews', reviewRoutes); // Review routes

// Debug route to show all API endpoints
app.get('/api/routes', (req, res) => {
    const routes = [];
    
    // Get routes from each router
    function printRoutes(stack, basePath = '') {
        stack.forEach(layer => {
            if (layer.route) {
                const path = basePath + layer.route.path;
                const methods = Object.keys(layer.route.methods)
                    .filter(method => layer.route.methods[method])
                    .map(method => method.toUpperCase());
                routes.push({ path, methods });
            } else if (layer.name === 'router' && layer.handle.stack) {
                const routerPath = basePath + (layer.regexp.source === "^\\/?(?=\\/|$)" ? '' : layer.regexp.source.replace(/\\\//g, '/').replace(/\^|\$/g, '').replace(/\\\?/g, '?'));
                printRoutes(layer.handle.stack, routerPath);
            }
        });
    }
    
    printRoutes(app._router.stack);
    
    res.json({
        message: 'Available API routes',
        routes: routes.filter(route => route.path.startsWith('/api'))
    });
});

// Catch all route for debugging API 404s
app.all('/api/*', (req, res) => {
    console.error(`API Route Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
        availableEndpoints: '/api/routes'
    });
});

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
