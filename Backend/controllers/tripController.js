const Trip = require('../models/Trip');
const { generateItineraryAI, optimizeItineraryAI } = require('../services/aiService');
const { getIsConnected } = require('../config/db');

// In-memory store for trips in demo mode
const memoryTrips = [];

const generateTrip = async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination || typeof destination !== 'string' || !destination.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Destination name is required (e.g. Kolkata, Paris, Tokyo).'
      });
    }

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
    const userId = req.user ? (req.user.id || req.user._id) : 'demo_user_1';
    const body = req.body || {};
    const itinerary = body.itinerary || body;

    const daysArray = Array.isArray(itinerary.days)
      ? itinerary.days
      : (Array.isArray(body.days) ? body.days : []);

    const totalBudget = Number(body.budget || body.customBudget || itinerary.customBudget || itinerary.estimatedCost) || 20000;

    const tripData = {
      userId,
      destination: body.destination || itinerary.destination || 'Kolkata',
      startDate: body.startDate || itinerary.startDate || '',
      endDate: body.endDate || itinerary.endDate || '',
      travelers: Number(body.travelers || itinerary.travelers) || 2,
      budgetType: body.budgetCategory || body.budgetType || itinerary.budgetType || 'Moderate',
      customBudget: totalBudget,
      travelStyles: itinerary.travelStyles || body.travelStyles || body.interests || ['Cultural', 'Heritage'],
      days: daysArray,
      budgetBreakdown: itinerary.budgetBreakdown || {
        accommodation: Math.round(totalBudget * 0.35),
        food: Math.round(totalBudget * 0.25),
        transport: Math.round(totalBudget * 0.15),
        activities: Math.round(totalBudget * 0.15),
        shopping: Math.round(totalBudget * 0.06),
        emergency: Math.round(totalBudget * 0.04),
        total: totalBudget,
      },
      sustainabilityScore: itinerary.sustainabilityScore || 88,
      localScore: itinerary.localScore || 92,
      explanation: itinerary.explanation || `Custom planned trip to ${body.destination || 'destination'}.`,
      createdAt: new Date()
    };

    const isConnected = getIsConnected();
    let saved;

    if (isConnected) {
      try {
        saved = await Trip.create(tripData);
      } catch (dbErr) {
        console.warn('MongoDB saveTrip warning, falling back to memory store:', dbErr.message);
        saved = { _id: 'trip_' + Date.now(), ...tripData };
        memoryTrips.push(saved);
      }
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
    return res.status(500).json({ success: false, message: error.message || 'Failed to save trip.' });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id) : 'demo_user_1';
    const isConnected = getIsConnected();

    let trips = [];
    if (isConnected) {
      try {
        trips = await Trip.find({ userId }).sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn('MongoDB getMyTrips warning, using memory fallback:', dbErr.message);
        trips = memoryTrips.filter(t => t.userId === userId || userId === 'demo_user_1' || t.userId === 'guest_user_demo');
      }
    } else {
      trips = memoryTrips.filter(t => t.userId === userId || userId === 'demo_user_1' || t.userId === 'guest_user_demo');
    }

    return res.json({ success: true, count: trips.length, trips });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch trips.' });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    let trip;
    if (isConnected) {
      try {
        trip = await Trip.findById(id);
      } catch (dbErr) {
        trip = memoryTrips.find(t => t._id === id);
      }
    } else {
      trip = memoryTrips.find(t => t._id === id);
    }

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    return res.json({ success: true, trip });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch trip details.' });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user.id || req.user._id) : null;
    const isConnected = getIsConnected();

    if (isConnected) {
      try {
        const trip = await Trip.findById(id);
        if (!trip) {
          return res.status(404).json({ success: false, message: 'Trip not found.' });
        }
        // Security ownership check
        if (userId && trip.userId && trip.userId !== userId && trip.userId !== 'demo_user_1') {
          return res.status(403).json({ success: false, message: 'Unauthorized to delete this expedition.' });
        }
        await Trip.findByIdAndDelete(id);
      } catch (dbErr) {
        const idx = memoryTrips.findIndex(t => t._id === id);
        if (idx !== -1) memoryTrips.splice(idx, 1);
      }
    } else {
      const idx = memoryTrips.findIndex(t => t._id === id);
      if (idx !== -1) memoryTrips.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete trip.' });
  }
};

const duplicateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();
    let original;

    if (isConnected) {
      try {
        original = await Trip.findById(id);
      } catch (dbErr) {
        original = memoryTrips.find(t => t._id === id);
      }
    } else {
      original = memoryTrips.find(t => t._id === id);
    }

    if (!original) {
      return res.status(404).json({ success: false, message: 'Original trip not found.' });
    }

    const plainOriginal = original.toObject ? original.toObject() : { ...original };
    delete plainOriginal._id;
    plainOriginal.destination = `${plainOriginal.destination} (Copy)`;
    plainOriginal.createdAt = new Date();

    let duplicated;
    if (isConnected) {
      try {
        duplicated = await Trip.create(plainOriginal);
      } catch (dbErr) {
        duplicated = { _id: 'trip_' + Date.now(), ...plainOriginal };
        memoryTrips.push(duplicated);
      }
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
    return res.status(500).json({ success: false, message: error.message || 'Failed to duplicate trip.' });
  }
};

const toggleVisitedStatus = async (req, res) => {
  try {
    const { tripId, dayIndex = 0, activityIndex = 0 } = req.body;
    const isConnected = getIsConnected();

    if (isConnected && tripId) {
      const trip = await Trip.findById(tripId);
      if (trip && trip.days && trip.days[dayIndex]?.activities?.[activityIndex]) {
        const current = !!trip.days[dayIndex].activities[activityIndex].visited;
        trip.days[dayIndex].activities[activityIndex].visited = !current;
        await trip.save();
        return res.json({
          success: true,
          visited: !current,
          message: `Activity marked as ${!current ? 'visited' : 'unvisited'}!`
        });
      }
    }

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
