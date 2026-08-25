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
const { connectDB, getIsConnected } = require('./config/db');
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
    // Allow same-origin, no-origin (mobile/curl), and localhost requests
    if (!origin) return callback(null, true);
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) return callback(null, true);
    // Allow Vercel preview deployments and the live domain
    if (origin.includes('vercel.app') || origin.includes('travelgenie')) return callback(null, true);
    const allowed = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '')
      .split(',').map(o => o.trim()).filter(Boolean);
    if (allowed.some(a => origin.startsWith(a))) return callback(null, true);
    // In production only block unknown external origins
    if (process.env.NODE_ENV === 'production' && allowed.length > 0) {
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
// Smart Body Parsing (Vercel Serverless pre-parses req.body)
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return next();
  }
  express.json({ limit: '5mb' })(req, res, (err) => {
    if (err) {
      console.warn('JSON parsing note, falling back to empty body:', err.message);
      req.body = {};
    }
    next();
  });
});
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return next();
  }
  express.urlencoded({ extended: true, limit: '5mb' })(req, res, () => next());
});

// Passport initialization
app.use(passport.initialize());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  validate: { trustProxy: false, xForwardedForHeader: false },
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

// Lazy DB connection middleware for Serverless (Vercel) - Non-blocking
let isDbConnecting = false;
app.use((req, res, next) => {
  if (!getIsConnected() && process.env.MONGODB_URI && !isDbConnecting) {
    isDbConnecting = true;
    connectDB()
      .catch((e) => console.warn('Lazy DB connection note:', e.message))
      .finally(() => { isDbConnecting = false; });
  }
  next();
});

// ─── Google OAuth Routes ─────────────────────────────────────────
app.get('/api/auth/google', (req, res, next) => {
  const host = req.get('host');
  const frontendUrl = process.env.FRONTEND_URL || (host && !host.includes('localhost') ? `https://${host}` : 'http://localhost:5173');
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${frontendUrl}/login?error=google_not_configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

app.get('/api/auth/google/callback', (req, res, next) => {
  const host = req.get('host');
  const frontendUrl = process.env.FRONTEND_URL || (host && !host.includes('localhost') ? `https://${host}` : 'http://localhost:5173');
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${frontendUrl}/login?error=google_not_configured`);
  }

  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error('Passport OAuth Callback Error:', err || info);
      return res.redirect(`${frontendUrl}/login?error=google_failed`);
    }
    req.user = user;
    return googleAuthCallback(req, res);
  })(req, res, next);
});
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

// Export for Vercel serverless handler
module.exports = app;

// Only start listening when running directly (not in serverless)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 TravelGenie Server running on http://localhost:${PORT}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔐 Google OAuth: http://localhost:${PORT}/api/auth/google`);
        console.log(`✨ API Base: http://localhost:${PORT}/api`);
      }
    });
  });
}
