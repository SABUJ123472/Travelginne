const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: String,
  place: String,
  description: String,
  estimatedCost: Number,
  distance: String,
  travelTime: String,
  recommendedTransport: String,
  whyRecommended: String,
  visited: { type: Boolean, default: false }
});

const dayPlanSchema = new mongoose.Schema({
  day: Number,
  title: String,
  activities: [activitySchema]
});

const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: String,
  endDate: String,
  travelers: Number,
  budgetType: String,
  customBudget: Number,
  travelStyles: [String],
  preferences: [String],
  days: [dayPlanSchema],
  budgetBreakdown: {
    accommodation: Number,
    food: Number,
    transport: Number,
    activities: Number,
    shopping: Number,
    emergency: Number,
    total: Number
  },
  sustainabilityScore: { type: Number, default: 85 },
  localScore: { type: Number, default: 92 },
  explanation: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);
