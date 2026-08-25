const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const { registerUser, loginUser, getProfile, updatePreferences } = require('../controllers/authController');
const { generateTrip, optimizeTrip, saveTrip, getMyTrips, getTripById, deleteTrip, duplicateTrip, toggleVisitedStatus } = require('../controllers/tripController');
const { getDestinations, getHiddenGems, getCultureStories, searchCultureStory, getSearchHistory } = require('../controllers/destinationController');
const { chatWithAI } = require('../controllers/assistantController');
const { calculateBudget } = require('../controllers/budgetController');
const { getSafetyAndWeather } = require('../controllers/safetyController');
const { translateText, getTravelPhrases } = require('../controllers/translatorController');
const { navigateTransport } = require('../controllers/transportController');
const { getNearbyPlaces, getPlaceInfo, getEmergencyContacts } = require('../controllers/nearbyController');
const { getEvents } = require('../controllers/eventController');
const { checkInPlace, claimDailyBonus, getLeaderboard, getUserStats, awardDestinationPoints } = require('../controllers/rewardController');

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/profile', authMiddleware, getProfile);
router.put('/auth/preferences', authMiddleware, updatePreferences);

// Trip routes
router.post('/trips/generate', generateTrip);
router.post('/trips/optimize', optimizeTrip);
router.post('/trips/save', authMiddleware, saveTrip);
router.get('/trips/my-trips', authMiddleware, getMyTrips);
router.get('/trips/:id', getTripById);
router.delete('/trips/:id', authMiddleware, deleteTrip);
router.post('/trips/:id/duplicate', authMiddleware, duplicateTrip);
router.post('/trips/visited', authMiddleware, toggleVisitedStatus);

// Destinations & Hidden Gems
router.get('/destinations', getDestinations);
router.get('/destinations/hidden-gems', getHiddenGems);
router.get('/destinations/culture-stories', getCultureStories);
router.get('/destinations/culture-search', searchCultureStory);
router.get('/destinations/search-history', authMiddleware, getSearchHistory);

// AI Chatbot Assistant
router.post('/assistant/chat', chatWithAI);

// Smart Budget Planner
router.post('/budget/calculate', calculateBudget);

// Weather & Safety
router.get('/safety', getSafetyAndWeather);

// Translator & Phrasebook
router.post('/translator/translate', translateText);
router.get('/translator/phrases', getTravelPhrases);

// Public Transport Navigation
router.post('/transport/route', navigateTransport);

// Nearby Facilities & Emergency SOS
router.get('/nearby', getNearbyPlaces);
router.get('/nearby/place-info', getPlaceInfo);
router.get('/emergency', getEmergencyContacts);

// Events
router.get('/events', getEvents);

// Cell Tower Check-In & Leaderboard Rewards
router.post('/rewards/check-in', authMiddleware, checkInPlace);
router.post('/rewards/daily-bonus', authMiddleware, claimDailyBonus);
router.post('/rewards/destination', authMiddleware, awardDestinationPoints);
router.get('/rewards/leaderboard', getLeaderboard);
router.get('/rewards/user-stats', authMiddleware, getUserStats);

module.exports = router;
