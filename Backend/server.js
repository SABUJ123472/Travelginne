const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible cross-origin resources & tile maps
}));

// CORS Configuration
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rate Limiting (150 requests per 15 mins window for API protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use('/api', limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

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
  // Root welcome route for dev
  app.get('/', (req, res) => {
    res.json({
      app: "TravelGenie API Server",
      status: "Production Ready",
      version: "1.0.0",
      docs: "/api",
      message: "TravelGenie Backend is running and ready for deployment!"
    });
  });
}

// Global Production Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Port and Server Launch
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 TravelGenie Server running on http://localhost:${PORT}`);
    console.log(`✨ API Base Endpoint: http://localhost:${PORT}/api`);
  });
});
