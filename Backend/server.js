const dotenv = require('dotenv');
dotenv.config(); // ← Must be FIRST before any other require that reads process.env

// Validate environment variables gracefully
const requiredKeys = ['JWT_SECRET', 'MONGODB_URI', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missingKeys = requiredKeys.filter(k => !process.env[k]);
if (missingKeys.length > 0) {
  console.warn(`⚠️ Warning: Missing optional/suggested environment variables: ${missingKeys.join(', ')}. App running with fallback modes where applicable.`);
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'travelgenie_default_jwt_secret_key_2026';
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const path = require('path');
const { connectDB } = require('./config/db');
const passport = require('./config/passport');
const apiRoutes = require('./routes/api');
const { googleAuthCallback } = require('./controllers/authController');

const app = express();

// Trust reverse proxy (Vercel, Render, Cloudflare) for HTTPS and hostname
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    const allowed = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '')
      .split(',').map(o => o.trim()).filter(Boolean);
    if (allowed.includes(origin)) return callback(null, true);
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Session (for Passport OAuth flow only — JWT is used for actual auth)
app.use(session({
  secret: process.env.JWT_SECRET || 'travelgenie_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 5 * 60 * 1000 }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', limiter);

// Request logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ─── Google OAuth Routes ─────────────────────────────────────────
app.get('/api/auth/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const frontendUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    return res.redirect(`${frontendUrl}/login?error=google_not_configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/api/auth/google/callback', (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${frontendUrl}/login?error=google_not_configured`);
  }
  passport.authenticate('google', {
    failureRedirect: `${frontendUrl}/login?error=google_failed`,
    session: false
  })(req, res, next);
}, googleAuthCallback);
// ─────────────────────────────────────────────────────────────────

// API Routes
app.use('/api', apiRoutes);

// Production Static Serving
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../Frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      app: 'TravelGenie API Server',
      status: 'Running',
      version: '1.0.0',
      endpoints: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        googleLogin: 'GET /api/auth/google',
      }
    });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled API Error:', err);
  }
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 TravelGenie Server running on http://localhost:${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔐 Google OAuth: http://localhost:${PORT}/api/auth/google`);
      console.log(`✨ API Base: http://localhost:${PORT}/api`);
    }
  });
});
