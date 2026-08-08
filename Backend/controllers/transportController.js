const { getTransportOptions } = require('../services/transportService');

const navigateTransport = async (req, res) => {
  try {
    const { from = 'Victoria Memorial', to = 'Howrah Railway Station' } = req.body;
    const data = await getTransportOptions(from, to);
    return res.json({ success: true, route: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to calculate transport routes.' });
  }
};

module.exports = { navigateTransport };
