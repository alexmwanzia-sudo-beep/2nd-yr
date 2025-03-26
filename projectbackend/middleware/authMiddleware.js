const jwt = require("jsonwebtoken");
require("dotenv").config();

// Unified Middleware for Token Authentication and Route Protection
const authenticateAndProtect = (req, res, next) => {
  const authHeader = req.header("Authorization"); // Extract 'Authorization' header
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const token = authHeader.replace("Bearer ", ""); // Remove "Bearer " prefix
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware/handler
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" }); // Unified error response
  }
};

module.exports = { authenticateAndProtect };
