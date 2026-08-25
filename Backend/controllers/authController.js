const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// In-memory user fallback store when MongoDB is not connected
const memoryUsers = [];

// Helper: generate JWT token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set in environment');
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, avatar: user.avatar || null },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper: safe user object for response
const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || null,
  authProvider: user.authProvider || 'local',
  travelStyle: user.travelStyle || [],
  preferredBudget: user.preferredBudget || 'Moderate',
  bio: user.bio || '',
  geniePoints: user.geniePoints || 350,
  travelerRank: user.travelerRank || 'Silver Voyager',
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password, travelStyle = ['Culture', 'History'], preferredBudget = 'Moderate' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const isConnected = getIsConnected();
    let user;

    if (isConnected) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        authProvider: 'local',
        travelStyle,
        preferredBudget,
      });
      console.log(`✅ New user registered in MongoDB: ${email}`);
    } else {
      // Memory fallback — hash password even in memory mode
      const existing = memoryUsers.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = {
        _id: 'user_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        authProvider: 'local',
        travelStyle,
        preferredBudget,
        bio: 'Passionate traveler exploring the world with TravelGenie.',
        geniePoints: 350,
        travelerRank: 'Silver Voyager',
      };
      memoryUsers.push(user);
    }

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to TravelGenie.',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const isConnected = getIsConnected();
    let user;

    if (isConnected) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
      if (user.authProvider === 'google' && !user.password) {
        return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Please use the Google button to log in.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
    } else {
      user = memoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: safeUser(user),
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// Called after Google OAuth success — issues JWT and redirects to frontend
const googleAuthCallback = (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${frontendUrl}/login?error=google_failed`);
    }

    const token = generateToken(user);
    const userData = encodeURIComponent(JSON.stringify(safeUser(user)));

    // Redirect to frontend with token in query param
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${userData}`);
  } catch (error) {
    console.error('Google Callback Error:', error);
    return res.redirect(`${frontendUrl}/login?error=server_error`);
  }
};

const getProfile = async (req, res) => {
  try {
    const isConnected = getIsConnected();
    let user;

    if (isConnected) {
      user = await User.findById(req.user.id).select('-password');
    }

    if (!user) {
      user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar || null,
        travelStyle: ['History', 'Food', 'Culture'],
        preferredBudget: 'Moderate',
        favoriteDestinations: ['Kolkata', 'Jaipur', 'Goa'],
        bio: 'Avid explorer exploring hidden gems with TravelGenie AI.',
        geniePoints: 350,
        travelerRank: 'Silver Voyager',
      };
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { travelStyle, preferredBudget, bio } = req.body;
    const isConnected = getIsConnected();

    if (isConnected) {
      await User.findByIdAndUpdate(req.user.id, { travelStyle, preferredBudget, bio }, { new: true });
    }

    return res.json({
      success: true,
      message: 'Travel preferences updated successfully!',
      preferences: { travelStyle, preferredBudget, bio },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update preferences.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuthCallback,
  getProfile,
  updatePreferences,
};
