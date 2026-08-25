const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to reliably resolve MongoDB Atlas SRV records
// (Some ISP/local DNS servers block or fail on SRV lookups)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('----------------------------------------------------');
    console.log('⚡ NOTICE: MONGODB_URI is not configured in .env');
    console.log('⚡ TravelGenie Backend is running in DEMO MODE with In-Memory Database Store.');
    console.log('⚡ All features, trip planning, auth, and queries will function seamlessly!');
    console.log('----------------------------------------------------');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.log('⚡ Falling back to TravelGenie DEMO In-Memory Store.');
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
