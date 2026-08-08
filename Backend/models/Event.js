const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: String,
  title: String,
  city: String,
  date: String,
  location: String,
  description: String,
  estimatedCost: Number,
  category: String, // Festival, Cultural, Market, Concert, Exhibition, Seasonal
  image: String
});

module.exports = mongoose.model('Event', eventSchema);
