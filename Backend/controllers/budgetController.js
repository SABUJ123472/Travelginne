// Destination Pricing Matrix & Curated Real-World Line Items
const DESTINATION_CONFIGS = {
  kolkata: {
    basePerDayPerPerson: { Budget: 1800, Moderate: 3800, Luxury: 9500 },
    items: [
      { category: 'Accommodation', name: 'Heritage Rajbari / Boutique Stay', costRatio: 0.35 },
      { category: 'Food', name: 'Peter Cat, Mocambo & Street Food Allowances', costRatio: 0.25 },
      { category: 'Transit', name: 'Kolkata Metro Smart Pass & Yellow Taxis', costRatio: 0.15 },
      { category: 'Activities', name: 'Victoria Memorial & Indian Museum Entry Pass', costRatio: 0.15 },
      { category: 'Shopping', name: 'New Market Sweets & Bengal Handloom', costRatio: 0.10 },
    ],
    tips: [
      "Use Kolkata Metro and Hooghly River ferries to travel between landmarks for under ₹20/ride.",
      "Explore College Street book stalls & mishti shops for authentic treats at local prices.",
      "Book Victoria Memorial and Science City combo tickets online to skip queues."
    ]
  },
  jaipur: {
    basePerDayPerPerson: { Budget: 2200, Moderate: 4500, Luxury: 12000 },
    items: [
      { category: 'Accommodation', name: 'Haveli Heritage Homestay / Palace Hotel', costRatio: 0.38 },
      { category: 'Food', name: 'Chokhi Dhani Dinner & Rajasthani Thali', costRatio: 0.24 },
      { category: 'Transit', name: 'Jaipur E-Rickshaw & Fort Cab Hire', costRatio: 0.14 },
      { category: 'Activities', name: 'Amber Fort, Hawa Mahal & Jantar Mantar Pass', costRatio: 0.14 },
      { category: 'Shopping', name: 'Johari Bazaar Blue Pottery & Bandhani Textiles', costRatio: 0.10 },
    ],
    tips: [
      "Purchase the Rajasthan Tourism Department Composite Ticket for entry to 8 heritage monuments.",
      "Rent an auto-rickshaw on a full-day fixed package (approx. ₹700–900) rather than individual trip fares.",
      "Bargain respectfully in Bapu and Johari Bazaars for traditional handicrafts."
    ]
  },
  goa: {
    basePerDayPerPerson: { Budget: 2500, Moderate: 5200, Luxury: 14000 },
    items: [
      { category: 'Accommodation', name: 'Beachside Villa / Portuguese Cottage', costRatio: 0.40 },
      { category: 'Food', name: 'Seafood Shacks & Panjim Latin Quarter Cafes', costRatio: 0.25 },
      { category: 'Transit', name: 'Self-Drive Scooter / Car Rental + Fuel', costRatio: 0.15 },
      { category: 'Activities', name: 'Mandovi River Sunset Cruise & Water Sports', costRatio: 0.12 },
      { category: 'Shopping', name: 'Anjuna Flea Market Spices & Cashews', costRatio: 0.08 },
    ],
    tips: [
      "Rent a two-wheeler (scooter) for ₹400–600/day to cut transit expenses by 70%.",
      "Dine at authentic Goan home kitchens in South Goa rather than expensive beach shacks in North Goa.",
      "Travel in early November or February to avoid peak December holiday price surges."
    ]
  },
  darjeeling: {
    basePerDayPerPerson: { Budget: 2000, Moderate: 4200, Luxury: 10500 },
    items: [
      { category: 'Accommodation', name: 'Colonial Tea Estate Homestay / Mountain Lodge', costRatio: 0.38 },
      { category: 'Food', name: 'Glenary\'s Bakery, Keventers & Momos Allowance', costRatio: 0.24 },
      { category: 'Transit', name: 'Shared Jeeps to Tiger Hill & Rock Garden', costRatio: 0.16 },
      { category: 'Activities', name: 'Toy Train Joy Ride & Ropeway Pass', costRatio: 0.14 },
      { category: 'Shopping', name: 'First Flush Darjeeling Tea & Woolen Handicrafts', costRatio: 0.08 },
    ],
    tips: [
      "Use shared Tata Sumo jeeps from Siliguri/NJP instead of private taxis to save ₹2,500.",
      "Book the UNESCO Himalayan Toy Train joyride on the IRCTC portal 30 days in advance.",
      "Walk the scenic Mall Road and Observatory Hill trails for zero-cost breathtaking vistas."
    ]
  },
  paris: {
    basePerDayPerPerson: { Budget: 9500, Moderate: 18500, Luxury: 45000 },
    items: [
      { category: 'Accommodation', name: 'Montmartre / Latin Quarter Boutique Hotel', costRatio: 0.42 },
      { category: 'Food', name: 'Boulangerie Breakfasts, Bistros & Wine', costRatio: 0.26 },
      { category: 'Transit', name: 'Paris Visite Metro / Navigo Weekly Pass', costRatio: 0.12 },
      { category: 'Activities', name: 'Louvre Museum, Eiffel Tower & Seine Cruise', costRatio: 0.12 },
      { category: 'Shopping', name: 'Champs-Élysées Souvenirs & French Perfumes', costRatio: 0.08 },
    ],
    tips: [
      "Get the Paris Museum Pass for skip-the-line access to over 50 monuments.",
      "Buy a Navigo Easy Metro contactless card for discounted T+ transit carnets.",
      "Enjoy picnic lunches with fresh baguettes, cheeses, and pastries by the Seine."
    ]
  },
  tokyo: {
    basePerDayPerPerson: { Budget: 9000, Moderate: 17500, Luxury: 42000 },
    items: [
      { category: 'Accommodation', name: 'Shinjuku / Shibuya Ryokan or Business Hotel', costRatio: 0.40 },
      { category: 'Food', name: 'Ramen Alleys, Sushi Conveyor & Izakaya Dining', costRatio: 0.26 },
      { category: 'Transit', name: 'Suica / Pasmo IC Card & Tokyo Metro Pass', costRatio: 0.14 },
      { category: 'Activities', name: 'TeamLab Planets, Tokyo Tower & Shrine Passes', costRatio: 0.12 },
      { category: 'Shopping', name: 'Akihabara Tech & Don Quijote Souvenirs', costRatio: 0.08 },
    ],
    tips: [
      "Purchase a 72-hour Tokyo Subway Ticket for unlimited rides across Tokyo Metro lines.",
      "Eat at high-quality Konbini (7-Eleven, Lawson) and ramen vending-machine eateries.",
      "Many observation decks, like Tokyo Metropolitan Government Building, are 100% free."
    ]
  },
  delhi: {
    basePerDayPerPerson: { Budget: 2000, Moderate: 4200, Luxury: 11000 },
    items: [
      { category: 'Accommodation', name: 'South Delhi Heritage B&B / Connaught Place Hotel', costRatio: 0.36 },
      { category: 'Food', name: 'Chandni Chowk Street Food & Pandara Road Dining', costRatio: 0.25 },
      { category: 'Transit', name: 'Delhi Metro Smart Card & App Cabs', costRatio: 0.15 },
      { category: 'Activities', name: 'Red Fort, Qutub Minar & Humayun Tomb Pass', costRatio: 0.14 },
      { category: 'Shopping', name: 'Dilli Haat Crafts & Janpath Attire', costRatio: 0.10 },
    ],
    tips: [
      "Delhi Metro is the fastest and most cost-effective way to bypass heavy traffic.",
      "Dilli Haat provides certified artisan goods with government-regulated fair pricing.",
      "Monuments under ASI offer 10% discounts when booking tickets via QR code at the entrance."
    ]
  }
};

const calculateBudget = async (req, res) => {
  try {
    const {
      destination = 'Kolkata',
      totalBudget,
      travelers = 2,
      duration = 3,
      budgetType = 'Moderate'
    } = req.body;

    const destKey = destination.toLowerCase().trim();
    const config = DESTINATION_CONFIGS[destKey] || {
      basePerDayPerPerson: { Budget: 2200, Moderate: 4500, Luxury: 11500 },
      items: [
        { category: 'Accommodation', name: `${destination} Hotels & Homestays`, costRatio: 0.36 },
        { category: 'Food', name: `${destination} Regional Dining & Street Food`, costRatio: 0.25 },
        { category: 'Transit', name: `${destination} Local Transit & Cabs`, costRatio: 0.15 },
        { category: 'Activities', name: `${destination} Landmark & Sightseeing Pass`, costRatio: 0.14 },
        { category: 'Shopping', name: `${destination} Local Souvenirs & Crafts`, costRatio: 0.10 },
      ],
      tips: [
        `Use public transport and local shared rides across ${destination} to save on daily conveyance.`,
        `Ask locals for authentic family-run eateries for the freshest regional meals at modest prices.`,
        `Book key landmark entry tickets online to bypass long ticket queues.`
      ]
    };

    const numTravelers = Math.max(1, Number(travelers) || 2);
    const numDays = Math.max(1, Number(duration) || 3);
    const tier = ['Budget', 'Moderate', 'Luxury'].includes(budgetType) ? budgetType : 'Moderate';

    // Auto-calculate suggested baseline if totalBudget not explicitly forced
    const suggestedDaily = config.basePerDayPerPerson[tier] || 4500;
    const computedTotal = totalBudget ? Number(totalBudget) : (suggestedDaily * numTravelers * numDays);

    // Itemized line items tailored to this destination
    const generatedItems = config.items.map((item, idx) => ({
      id: idx + 1,
      category: item.category,
      name: item.name,
      cost: Math.round(computedTotal * item.costRatio)
    }));

    const accommodation = Math.round(computedTotal * 0.36);
    const food = Math.round(computedTotal * 0.25);
    const transport = Math.round(computedTotal * 0.15);
    const activities = Math.round(computedTotal * 0.14);
    const shopping = Math.round(computedTotal * 0.10);

    return res.json({
      success: true,
      destination,
      totalBudget: computedTotal,
      travelers: numTravelers,
      duration: numDays,
      budgetType: tier,
      breakdown: {
        accommodation,
        food,
        transport,
        activities,
        shopping
      },
      items: generatedItems,
      optimizationTips: config.tips
    });
  } catch (error) {
    console.error('Budget calculation error:', error);
    return res.status(500).json({ success: false, message: 'Budget calculation failed.' });
  }
};

module.exports = { calculateBudget };
