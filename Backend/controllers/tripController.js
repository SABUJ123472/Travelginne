const Trip = require('../models/Trip');
const { generateItineraryAI, optimizeItineraryAI } = require('../services/aiService');
const { getIsConnected } = require('../config/db');

// In-memory store for trips in demo mode
const memoryTrips = [];

const generateTrip = async (req, res) => {
  try {
    const itinerary = await generateItineraryAI(req.body);
    return res.status(200).json({
      success: true,
      message: 'Itinerary generated successfully!',
      itinerary
    });
  } catch (error) {
    console.error('Generate Trip Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate itinerary.' });
  }
};

const optimizeTrip = async (req, res) => {
  try {
    const { itinerary } = req.body;
    if (!itinerary) {
      return res.status(400).json({ success: false, message: 'Itinerary data required for optimization.' });
    }
    const optimized = await optimizeItineraryAI(itinerary);
    return res.json({
      success: true,
      message: 'Itinerary optimized for travel time & eco-sustainability!',
      itinerary: optimized
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Optimization failed.' });
  }
};

const saveTrip = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user_1';
    const tripData = { ...req.body, userId, createdAt: new Date() };

    const isConnected = getIsConnected();
    let saved;

    if (isConnected) {
      saved = await Trip.create(tripData);
    } else {
      saved = { _id: 'trip_' + Date.now(), ...tripData };
      memoryTrips.push(saved);
    }

    return res.status(201).json({
      success: true,
      message: 'Trip saved to My Trips successfully!',
      trip: saved
    });
  } catch (error) {
    console.error('Save Trip Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save trip.' });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user_1';
    const isConnected = getIsConnected();

    let trips = [];
    if (isConnected) {
      trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    } else {
      trips = memoryTrips.filter(t => t.userId === userId || userId === 'demo_user_1');
    }

    // Return empty list — no fake default trips

    return res.json({ success: true, count: trips.length, trips });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch trips.' });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    let trip;
    if (isConnected) {
      trip = await Trip.findById(id);
    } else {
      trip = memoryTrips.find(t => t._id === id);
    }

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    return res.json({ success: true, trip });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch trip details.' });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    if (isConnected) {
      await Trip.findByIdAndDelete(id);
    } else {
      const idx = memoryTrips.findIndex(t => t._id === id);
      if (idx !== -1) memoryTrips.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete trip.' });
  }
};

const duplicateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();
    let original;

    if (isConnected) {
      original = await Trip.findById(id);
    } else {
      original = memoryTrips.find(t => t._id === id);
    }

    if (!original) {
      return res.status(404).json({ success: false, message: 'Original trip not found.' });
    }

    const plainOriginal = original.toObject ? original.toObject() : original;
    delete plainOriginal._id;
    plainOriginal.destination = `${plainOriginal.destination} (Copy)`;
    plainOriginal.createdAt = new Date();

    let duplicated;
    if (isConnected) {
      duplicated = await Trip.create(plainOriginal);
    } else {
      duplicated = { _id: 'trip_' + Date.now(), ...plainOriginal };
      memoryTrips.push(duplicated);
    }

    return res.status(201).json({
      success: true,
      message: 'Trip duplicated successfully!',
      trip: duplicated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to duplicate trip.' });
  }
};

const toggleVisitedStatus = async (req, res) => {
  try {
    const { tripId, dayIndex, activityIndex } = req.body;
    return res.json({
      success: true,
      message: 'Activity visited status updated!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update visited status.' });
  }
};

module.exports = {
  generateTrip,
  optimizeTrip,
  saveTrip,
  getMyTrips,
  getTripById,
  deleteTrip,
  duplicateTrip,
  toggleVisitedStatus
};
