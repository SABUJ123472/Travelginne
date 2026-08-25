const mongoose = require('mongoose');
const dns = require('dns');

// Safely set DNS servers if allowed in current environment
try {
  if (typeof dns.setServers === 'function') {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  }
} catch (e) {
  // Ignored in sandboxed serverless environments
}

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return false;
  }

  // Reuse existing connection if ready
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected || mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };
