# Technical Documentation

## System Architecture

### Frontend Structure
```
frontend/
├── home.html              # Main landing page
├── user-profile/          # User profile related pages
│   ├── profile.html      # User dashboard
│   ├── profile.css       # Profile styles
│   └── profile.js        # Profile functionality
├── user-registration/     # Authentication pages
│   ├── registration-form.html
│   └── registration.js
├── cars2/                # Car images and assets
├── scripts/              # JavaScript modules
│   ├── more-info.js     # Car details functionality
│   └── review-handler.js # Review management
└── styles/               # Global styles
```

### Backend Structure
```
projectbackend/
├── config/
│   ├── db.js            # Database configuration
│   └── .env             # Environment variables
├── controllers/
│   ├── authController.js
│   ├── carcontrollers.js
│   ├── hirecontrollers.js
│   ├── profilecontrollers.js
│   ├── purchasecontrollers.js
│   └── reviewcontrollers.js
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── uploads.js       # File upload handling
├── models/
│   ├── authmodels.js
│   ├── carmodels.js
│   ├── hiremodels.js
│   ├── profilemodels.js
│   ├── purchasemodels.js
│   └── reviewmodels.js
├── routes/
│   ├── authRoutes.js
│   ├── car-routes.js
│   ├── hireroutes.js
│   ├── profileroutes.js
│   ├── purchaseroutes.js
│   └── reviewroutes.js
└── server.js            # Main application file
```

## Database Schema Details

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cars Table
```sql
CREATE TABLE cars (
    car_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    image_url VARCHAR(255),
    number_plate VARCHAR(50),
    car_condition VARCHAR(50),
    mileage INT,
    price DECIMAL(10,2),
    available_for_hire BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT,
    car_review TEXT,
    car_rating INT,
    system_review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
);
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/register
Content-Type: application/json

Request Body:
{
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "password": "string"
}

Response:
{
    "success": true,
    "message": "User registered successfully",
    "token": "JWT_TOKEN"
}
```

#### Login User
```
POST /api/login
Content-Type: application/json

Request Body:
{
    "email": "string",
    "password": "string"
}

Response:
{
    "success": true,
    "token": "JWT_TOKEN"
}
```

### Car Management Endpoints

#### Add Car
```
POST /api/cars/add
Content-Type: multipart/form-data
Authorization: Bearer JWT_TOKEN

Request Body:
- make: string
- model: string
- year: number
- image: file
- price: number
- description: string
...

Response:
{
    "success": true,
    "message": "Car added successfully",
    "carId": number
}
```

### Review System Endpoints

#### Submit Car Review
```
POST /api/reviews/car
Content-Type: application/json
Authorization: Bearer JWT_TOKEN

Request Body:
{
    "carId": number,
    "carRating": number,
    "carReview": string
}

Response:
{
    "success": true,
    "message": "Review submitted successfully",
    "reviewId": number
}
```

## Frontend Components

### Profile Page
- User dashboard displaying:
  - Personal information
  - Listed cars
  - Hired cars
  - Reserved cars
  - Reviews
- Review management system
- Profile picture upload

### Car Details Page
- Detailed car information
- Hire/Reserve functionality
- Review submission
- Average rating display

## Security Implementation

### Authentication
- JWT-based token system
- Password hashing using bcrypt
- Token expiration and refresh mechanism

### Data Protection
- Input sanitization
- Prepared SQL statements
- XSS prevention
- CORS configuration

## Error Handling

### Backend Errors
```javascript
try {
    // Operation code
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
    });
}
```

### Frontend Errors
```javascript
try {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    // Handle success
} catch (error) {
    console.error('Error:', error);
    alert(error.message);
}
```

## Testing

### API Testing
Use Postman or similar tools to test endpoints:
1. Register user
2. Login and get token
3. Test protected routes with token
4. Verify response formats

### Frontend Testing
1. Form validation
2. Image upload
3. Review submission
4. Rating system
5. Responsive design

## Deployment

### Requirements
- Node.js v14+
- MySQL 8.0+
- npm or yarn
- Web server (e.g., nginx)

### Process
1. Set up production database
2. Configure environment variables
3. Build frontend assets
4. Start Node.js server
5. Configure reverse proxy

## Maintenance

### Regular Tasks
1. Database backup
2. Log rotation
3. Token cleanup
4. Image storage management
5. Error monitoring

### Performance Optimization
1. Image compression
2. Query optimization
3. Caching implementation
4. Code minification 