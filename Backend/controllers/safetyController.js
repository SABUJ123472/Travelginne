const { getWeatherAndSafety } = require('../services/weatherService');

const getSafetyAndWeather = async (req, res) => {
  try {
    const { city = 'Kolkata' } = req.query;
    const data = await getWeatherAndSafety(city);
    return res.json({ success: true, weatherSafety: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch weather & safety advisory.' });
  }
};

module.exports = { getSafetyAndWeather };
