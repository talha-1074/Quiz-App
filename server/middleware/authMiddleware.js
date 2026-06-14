// server/middleware/authMiddleware.js
// This checks if user is logged in before accessing protected routes

const jwt = require("jsonwebtoken");

// protect — checks JWT token from request header
const protect = (req, res, next) => {
  // Get token from header
  // Header looks like: "Bearer eyJhbGc..."
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    // Verify token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next(); // go to next function
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// allowRoles — checks if user has correct role
// Example: allowRoles('teacher') only allows teachers
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };
};

module.exports = { protect, allowRoles };
