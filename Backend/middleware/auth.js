const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token at all — assign guest for public routes
    req.user = { id: 'guest_user_demo', name: 'Traveler' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travelgenie_super_secret_jwt_key_2026');
    req.user = decoded;
    next();
  } catch (error) {
    // Invalid or expired token — return 401
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
};

// Strict version — requires a valid login (used for sensitive routes)
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travelgenie_super_secret_jwt_key_2026');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
};

module.exports = authMiddleware;
module.exports.requireAuth = requireAuth;
