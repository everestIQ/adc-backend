// iqexpress-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token'); // Common header name for JWTs

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user from token payload to the request object
    req.user = decoded.user; // decoded.user contains { id: user.id, role: user.role }
    next(); // Proceed to the next middleware/route handler

  } catch (error) {
    // Token is not valid (e.g., expired, malformed)
    res.status(401).json({ message: 'Token is not valid.' });
  }
};