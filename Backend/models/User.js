const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  placeId: String,
  placeName: String,
  city: String,
  pointsEarned: Number,
  isHiddenGem: Boolean,
  checkInTime: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name:                 { type: String, required: true },
  email:                { type: String, required: true, unique: true },
  password:             { type: String, default: null },
  googleId:             { type: String, default: null },
  avatar:               { type: String, default: null },
  authProvider:         { type: String, enum: ['local', 'google'], default: 'local' },
  travelStyle:          [{ type: String }],
  preferredBudget:      { type: String, default: 'Moderate' },
  favoriteDestinations: [{ type: String }],
  bio:                  { type: String, default: 'Passionate traveler exploring the world with TravelGenie.' },
  geniePoints:          { type: Number, default: 350 },
  travelerRank:         { type: String, default: 'Silver Voyager' },
  badges:               [{ type: String }],
  checkIns:             [checkInSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
