const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// In-memory user fallback store when MongoDB is not connected
const memoryUsers = [];

const registerUser = async (req, res) => {
  try {
    const { name, email, password, travelStyle = ['Culture', 'History'], preferredBudget = 'Moderate' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const isConnected = getIsConnected();
    let user;

    if (isConnected) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        travelStyle,
        preferredBudget
      });
    } else {
      const existing = memoryUsers.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      user = {
        _id: 'user_' + Date.now(),
        name,
        email,
        password,
        travelStyle,
        preferredBudget,
        bio: 'Passionate traveler exploring the world with TravelGenie.'
      };
      memoryUsers.push(user);
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'travelgenie_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        travelStyle: user.travelStyle,
        preferredBudget: user.preferredBudget,
        bio: user.bio
      }
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

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password.' });
      }
    } else {
      user = memoryUsers.find(u => u.email === email);
      if (!user || user.password !== password) {
        // Fallback for demo logins
        if (email === 'demo@travelgenie.com' && password === 'demo123') {
          user = {
            _id: 'demo_user_1',
            name: 'Alex Rivera',
            email: 'demo@travelgenie.com',
            travelStyle: ['History', 'Food', 'Culture'],
            preferredBudget: 'Moderate',
            bio: 'Avid explorer & backpacker.'
          };
        } else {
          return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }
      }
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'travelgenie_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        travelStyle: user.travelStyle,
        preferredBudget: user.preferredBudget,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
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
        id: req.user.id || 'demo_user_1',
        name: req.user.name || 'Alex Rivera',
        email: req.user.email || 'demo@travelgenie.com',
        travelStyle: ['History', 'Food', 'Culture', 'Photography'],
        preferredBudget: 'Moderate',
        favoriteDestinations: ['Kolkata', 'Jaipur', 'Goa'],
        bio: 'Avid explorer exploring hidden gems with TravelGenie AI.'
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
      await User.findByIdAndUpdate(req.user.id, {
        travelStyle,
        preferredBudget,
        bio
      });
    }

    return res.json({
      success: true,
      message: 'Travel preferences updated successfully!',
      preferences: { travelStyle, preferredBudget, bio }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update preferences.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updatePreferences
};
