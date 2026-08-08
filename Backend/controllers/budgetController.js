const calculateBudget = async (req, res) => {
  try {
    const { totalBudget = 20000, travelers = 2, duration = 3 } = req.body;
    const budget = Number(totalBudget) || 20000;

    const accommodation = Math.round(budget * 0.35);
    const food = Math.round(budget * 0.25);
    const transport = Math.round(budget * 0.15);
    const activities = Math.round(budget * 0.15);
    const shopping = Math.round(budget * 0.06);
    const emergency = Math.round(budget * 0.04);

    const tips = [
      "Book Metro Tourist Passes to save 40% on city transportation.",
      "Opt for heritage local eateries & street food over hotel dining to slash food costs by half.",
      "Visit museum & heritage monuments during early morning off-peak hours for discounted combo tickets.",
      "Stay in boutique home-stays near metro stations to reduce last-mile taxi fares."
    ];

    return res.json({
      success: true,
      totalBudget: budget,
      travelers,
      duration,
      breakdown: {
        accommodation,
        food,
        transport,
        activities,
        shopping,
        emergency
      },
      optimizationTips: tips
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Budget calculation failed.' });
  }
};

module.exports = { calculateBudget };
