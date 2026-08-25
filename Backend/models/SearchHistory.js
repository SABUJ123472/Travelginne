const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId:      { type: String, required: true, index: true },
  query:       { type: String, required: true },       // destination searched
  destination: { type: String },                        // normalized destination name
  daysRequested: { type: Number, default: 3 },
  budgetCategory:{ type: String, default: 'Moderate' },
  travelers:   { type: Number, default: 2 },
  source:      { type: String, enum: ['ai_planner', 'explore', 'search_bar', 'manual'], default: 'ai_planner' },
  resultFound: { type: Boolean, default: true },
  searchedAt:  { type: Date, default: Date.now, index: true },
}, { timestamps: false });

// Index to speed up "recent searches by user" queries
searchHistorySchema.index({ userId: 1, searchedAt: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
