const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no auth token provided, assign guest user ID for smooth demo experience
    req.user = { id: 'guest_user_demo', name: 'Traveler' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travelgenie_super_secret_jwt_key_2026');
    req.user = decoded;
    next();
  } catch (error) {
    // Graceful fallback to guest token in demo mode
    req.user = { id: 'guest_user_demo', name: 'Traveler' };
    next();
  }
};

module.exports = authMiddleware;
