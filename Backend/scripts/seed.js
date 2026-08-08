const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('../models/Destination');
const Event = require('../models/Event');
const { mockDestinations, mockEvents } = require('../data/mockData');

dotenv.config();

const seedDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is required in .env for database seeding!');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas for seeding...');

    await Destination.deleteMany({});
    await Event.deleteMany({});

    await Destination.insertMany(mockDestinations);
    await Event.insertMany(mockEvents);

    console.log(`✨ Successfully seeded ${mockDestinations.length} destinations & ${mockEvents.length} events into MongoDB Atlas!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedDB();
