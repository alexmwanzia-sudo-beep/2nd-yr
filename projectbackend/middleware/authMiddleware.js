const jwt = require("jsonwebtoken");
require("dotenv").config();

// Unified Middleware for Token Authentication and Route Protection
const authenticateAndProtect = (req, res, next) => {
  console.log("Auth middleware: Checking authorization header");
  
  const authHeader = req.header("Authorization"); // Extract 'Authorization' header
  if (!authHeader) {
    console.log("Auth middleware: No authorization header found");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    console.log("Auth middleware: Authorization header found:", authHeader.substring(0, 20) + "...");
    
    const token = authHeader.replace("Bearer ", ""); // Remove "Bearer " prefix
    console.log("Auth middleware: Token extracted:", token.substring(0, 10) + "...");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret"); // Verify the token
    console.log("Auth middleware: Token verified, decoded user:", decoded);
    
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware/handler
  } catch (error) {
    console.error("Auth middleware: Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid or expired token" }); // Unified error response
  }
};

module.exports = { authenticateAndProtect };
