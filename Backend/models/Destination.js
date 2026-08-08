const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  city: String,
  location: String,
  rating: Number,
  description: String,
  bestTimeToVisit: String,
  estimatedCost: Number,
  category: String, // Heritage, Nature, Food, Adventure, Shopping, Culture, Hidden Gem
  image: String,
  isHiddenGem: { type: Boolean, default: false },
  whySpecial: String,
  localStory: String,
  crowdLevel: String, // Low, Moderate, High
  safetyLevel: String, // Safe, Moderate, Exercise Caution
  nearbyAttractions: [String],
  whyRecommended: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Destination', destinationSchema);
