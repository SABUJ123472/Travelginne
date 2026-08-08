const { mockEvents } = require('../data/mockData');

const getEvents = async (req, res) => {
  try {
    const { city, category } = req.query;
    let list = [...mockEvents];

    // Only filter by city if a specific city is given
    if (city && city.trim() !== '' && city.toLowerCase() !== 'all') {
      list = list.filter(e => e.city.toLowerCase().includes(city.toLowerCase()));
    }

    // Filter by category
    if (category && category !== 'All') {
      list = list.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    return res.json({ success: true, count: list.length, events: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch local events.' });
  }
};

module.exports = { getEvents };
