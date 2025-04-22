# Car Hire System

## Overview
A modern web-based car hire and reservation system that allows users to hire, reserve, and review cars. The system features user authentication, profile management, car listings, reviews, and a comprehensive booking system.

## Features
- **User Management**
  - User registration and authentication
  - Profile management with customizable profile pictures
  - Personal dashboard with hire/reservation history

- **Car Management**
  - Detailed car listings with images and specifications
  - Car availability tracking
  - Car condition and history information
  - Price and negotiation settings

- **Booking System**
  - Car hire functionality
  - Car reservation system
  - Payment processing
  - Booking status tracking

- **Review System**
  - Car reviews with ratings
  - System feedback mechanism
  - Review management (view, create, delete)
  - Average rating calculations

- **Notification System**
  - Real-time notifications
  - Booking status updates
  - System announcements

## Technology Stack
- **Frontend**
  - HTML5, CSS3, JavaScript
  - Responsive design
  - FontAwesome icons
  - Modern UI/UX principles

- **Backend**
  - Node.js
  - Express.js
  - MySQL database
  - JWT authentication

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
cd projectbackend
npm install
```

3. Set up the database:
- Create a MySQL database named 'car_hire_db'
- Import the provided SQL schema
- Configure database connection in `config/db.js`

4. Configure environment variables:
Create a .env file with:
```
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=car_hire_db
JWT_SECRET=your_jwt_secret
```

5. Start the server:
```bash
npm start
```

## Database Schema

### Users Table
- Stores user information and authentication details
- Manages profile data and user roles

### Cars Table
- Contains car listings and specifications
- Tracks availability and pricing information

### Hires Table
- Records car hire transactions
- Manages hire status and duration

### Reservations Table
- Handles car reservations
- Tracks reservation status and payment

### Reviews Table
- Stores user reviews for cars
- Maintains rating system data

## API Endpoints

### Authentication
- POST /api/register - User registration
- POST /api/login - User login
- GET /api/profile - Get user profile

### Cars
- GET /api/cars - List all cars
- POST /api/cars/add - Add new car
- GET /api/cars/:id - Get car details

### Bookings
- POST /api/hire/book - Book a car
- POST /api/purchase/reserve - Reserve a car
- GET /api/user/bookings - Get user's bookings

### Reviews
- POST /api/reviews/car - Add car review
- GET /api/reviews/car/:carId - Get car reviews
- DELETE /api/reviews/:reviewId - Delete review

## Security Features
- JWT-based authentication
- Password hashing
- Input validation
- SQL injection prevention
- XSS protection

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[Your License Type]

## Contact
[Your Contact Information] 