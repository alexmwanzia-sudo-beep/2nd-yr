const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
//const carRoutes = require('./routes/carRoutes');

dotenv.config();
const app = express();


// Connect to MySQL
connectDB();

//app.use(express.json());
//app.use('/api/cars', carRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
