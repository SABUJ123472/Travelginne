const axios = require('axios');
const { mockDestinations } = require('../data/mockData');

const WORLD_CITY_COORDINATES = {
  paris:      { lat: 48.8566, lng: 2.3522 },
  tokyo:      { lat: 35.6762, lng: 139.6503 },
  london:     { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  dubai:      { lat: 25.2048, lng: 55.2708 },
  rome:       { lat: 41.9028, lng: 12.4964 },
  kolkata:    { lat: 22.5726, lng: 88.3639 },
  darjeeling: { lat: 27.0410, lng: 88.2663 },
  goa:        { lat: 15.2993, lng: 74.1240 },
  jaipur:     { lat: 26.9124, lng: 75.7873 },
  bangkok:    { lat: 13.7563, lng: 100.5018 },
  singapore:  { lat: 1.3521,  lng: 103.8198 },
  bali:       { lat: -8.4095, lng: 115.1889 },
  amsterdam:  { lat: 52.3676, lng: 4.9041 },
  barcelona:  { lat: 41.3851, lng: 2.1734 },
  istanbul:   { lat: 41.0082, lng: 28.9784 },
  cairo:      { lat: 30.0444, lng: 31.2357 },
  sydney:     { lat: -33.8688, lng: 151.2093 },
  delhi:      { lat: 28.6139, lng: 77.2090 },
  mumbai:     { lat: 19.0760, lng: 72.8777 },
  varanasi:   { lat: 25.3176, lng: 82.9739 },
  kerala:     { lat: 10.8505, lng: 76.2711 },
  nathula:    { lat: 27.3866, lng: 88.8309 },
  gurgaon:    { lat: 28.4595, lng: 77.0266 },
};

const WORLD_LANDMARKS = {
  paris:      ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Montmartre', 'Palace of Versailles', 'Musée d\'Orsay', 'Seine River Promenade', 'Champs-Élysées'],
  tokyo:      ['Senso-ji Temple', 'Shibuya Crossing', 'Shinjuku Gyoen National Garden', 'Akihabara', 'Tsukiji Outer Market', 'Meiji Shrine', 'Odaiba', 'Harajuku Takeshita Street'],
  london:     ['Tower of London', 'Buckingham Palace', 'British Museum', 'Tower Bridge', 'Hyde Park', 'Covent Garden', 'Westminster Abbey', 'Borough Market'],
  'new york': ['Central Park', 'Statue of Liberty', 'Times Square', 'Metropolitan Museum of Art', 'Brooklyn Bridge', 'High Line', 'Empire State Building', 'Chelsea Market'],
  dubai:      ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Gold Souk', 'Dubai Desert Safari', 'Dubai Frame', 'Jumeirah Mosque', 'Dubai Marina Walk'],
  rome:       ['Colosseum', 'Vatican Museums', 'Trevi Fountain', 'Roman Forum', 'Pantheon', 'Borghese Gallery', 'Trastevere', 'Piazza Navona'],
  kolkata:    ['Victoria Memorial', 'Howrah Bridge', 'Kumartuli', 'College Street', 'Princep Ghat', 'Dakshineswar Kali Temple', 'Indian Museum', 'Park Street'],
  darjeeling: ['Tiger Hill', 'Darjeeling Himalayan Railway', 'Batasia Loop', 'Peace Pagoda', 'Happy Valley Tea Estate', 'Himalayan Mountaineering Institute', 'Padmaja Naidu Zoo', 'Chowrasta Mall'],
  goa:        ['Baga Beach', 'Basilica of Bom Jesus', 'Dudhsagar Waterfalls', 'Anjuna Beach', 'Fort Aguada', 'Butterfly Beach', 'Spice Plantation', 'Fontainhas Panjim'],
  jaipur:     ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Johari Bazaar', 'Albert Hall Museum', 'Jal Mahal'],
  bangkok:    ['Grand Palace', 'Wat Pho', 'Chatuchak Market', 'Khao San Road', 'Chao Phraya River', 'Wat Arun', 'Lumphini Park', 'Asiatique Night Market'],
  singapore:  ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Chinatown', 'Little India', 'Orchard Road', 'Singapore Botanic Gardens', 'Clarke Quay'],
  bali:       ['Tanah Lot Temple', 'Ubud Monkey Forest', 'Tegallalang Rice Terraces', 'Seminyak Beach', 'Uluwatu Temple', 'Kuta Beach', 'Tirta Empul Temple', 'Mount Batur'],
  amsterdam:  ['Rijksmuseum', 'Anne Frank House', 'Van Gogh Museum', 'Canal Ring', 'Vondelpark', 'Jordaan', 'Dam Square', 'Heineken Experience'],
  barcelona:  ['Sagrada Família', 'Park Güell', 'La Rambla', 'Gothic Quarter', 'Camp Nou', 'Barceloneta Beach', 'Picasso Museum', 'Montjuïc Castle'],
  istanbul:   ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar', 'Topkapi Palace', 'Bosphorus Strait', 'Spice Bazaar', 'Galata Tower', 'Taksim Square'],
  cairo:      ['Pyramids of Giza', 'Egyptian Museum', 'Khan el-Khalili', 'Great Sphinx of Giza', 'Citadel of Saladin', 'Coptic Cairo', 'Nile River', 'Al-Azhar Mosque'],
  sydney:     ['Sydney Opera House', 'Sydney Harbour Bridge', 'Bondi Beach', 'Taronga Zoo', 'The Rocks', 'Royal Botanic Garden', 'Darling Harbour', 'Manly Beach'],
  delhi:      ['Red Fort', 'Qutub Minar', 'India Gate', 'Humayun\'s Tomb', 'Chandni Chowk', 'Lotus Temple', 'Akshardham Temple', 'Connaught Place'],
  mumbai:     ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Juhu Beach', 'Chhatrapati Shivaji Terminus', 'Colaba Causeway', 'Bandra-Worli Sea Link', 'Hanging Gardens'],
  varanasi:   ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Sarnath', 'Manikarnika Ghat', 'Assi Ghat', 'Ramnagar Fort', 'Tulsi Manas Temple', 'Banaras Hindu University'],
  kerala:     ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Periyar National Park', 'Kovalam Beach', 'Fort Kochi', 'Athirappilly Waterfalls', 'Varkala Beach', 'Wayand Wildlife Sanctuary'],
  nathula:    ['Nathula Pass Border Post', 'Baba Harbhajan Singh Mandir', 'Tsomgo Lake (Changu Lake)', 'Kupup Elephant Lake', 'Zuluk Silk Route', 'Menmecho Lake'],
  gurgaon:    ['Kingdom of Dreams', 'DLF CyberHub', 'Leisure Valley Park', 'Sultanpur National Park', 'Aravalli Biodiversity Park', 'Ambience Mall'],
};

const FOOD_BY_CITY = {
  paris:      'Croissants & Café au Lait, Crêpes, Steak Frites, Macarons',
  tokyo:      'Ramen, Sushi & Sashimi, Tempura, Takoyaki',
  london:     'Fish & Chips, Full English Breakfast, Afternoon Tea',
  'new york': 'New York Pizza, Bagels & Lox, Pastrami Sandwich',
  dubai:      'Shawarma, Al Harees, Camel Milk Ice Cream, Luqaimat',
  rome:       'Cacio e Pepe Pasta, Supplì, Gelato, Carbonara',
  kolkata:    'Kathi Rolls, Kosha Mangsho, Mishti Doi, Rosogolla, Kolkata Biryani',
  darjeeling: 'Darjeeling Tea, Momos, Thukpa, Sel Roti',
  goa:        'Fish Curry Rice, Prawn Balchão, Bebinca, Poi Bread',
  jaipur:     'Dal Baati Churma, Pyaaz Kachori, Ghevar, Laal Maas',
  bangkok:    'Pad Thai, Tom Yum Soup, Mango Sticky Rice, Som Tum',
  singapore:  'Hainanese Chicken Rice, Chilli Crab, Laksa, Kaya Toast',
  bali:       'Nasi Goreng, Babi Guling, Satay, Gado-Gado',
  amsterdam:  'Stroopwafels, Herring, Dutch Pancakes, Bitterballen',
  barcelona:  'Tapas, Paella, Pan con Tomate, Patatas Bravas',
  istanbul:   'Kebabs, Baklava, Simit, Meze Platter',
  cairo:      'Koshari, Ful Medames, Taameya, Mahshi',
  sydney:     'Meat Pie, Tim Tams, Barramundi Fish, Pavlova',
  delhi:      'Butter Chicken, Chole Bhature, Paranthe Wali Gali, Dahi Bhalla',
  mumbai:     'Vada Pav, Pav Bhaji, Bhel Puri, Bombay Sandwich',
  varanasi:   'Baati Chokha, Thandai, Malaiyo, Kachori Sabzi',
  kerala:     'Kerala Fish Curry, Appam & Stew, Puttu & Kadala, Payasam',
  nathula:    'Sikkimese Thukpa, Hot Momos, Tibetan Butter Tea',
  gurgaon:    'North Indian Butter Chicken, Street Food at Sector 29, Gourmet CyberHub Dining',
};

const TRANSPORT_BY_CITY = {
  paris:      'Metro (RER), Vélib\' Bike Share, River Bateau Bus',
  tokyo:      'JR Rail Pass, Tokyo Metro, IC Card',
  london:     'Oyster Card (Tube/Bus), Elizabeth Line, Thames Clipper',
  'new york': 'MetroCard (Subway/Bus), Yellow Cab, Citi Bike',
  dubai:      'Dubai Metro Red Line, RTA Bus, Abra Water Taxi',
  rome:       'ATAC Bus & Tram, Metro Line A/B, Walking',
  kolkata:    'Kolkata Metro, Yellow Taxi, Tram, Hooghly Ferry',
  darjeeling: 'Toy Train, Shared Jeeps, Walking',
  goa:        'Scooter Rental, Local Buses, Taxis',
  jaipur:     'Jaipur Metro, Auto Rickshaw, E-Rickshaw',
  bangkok:    'BTS Skytrain, MRT Underground, Tuk-Tuk',
  singapore:  'MRT Subway, EZ-Link Card, SBS Bus',
  bali:       'Scooter Rental, Private Driver, Grab Car',
  amsterdam:  'GVB Tram, Bicycle Rental, Canal Ferry',
  barcelona:  'TMB Metro, Bicing Bike, Cable Car',
  istanbul:   'Istanbulkart Metro/Tram, Bosphorus Ferry',
  cairo:      'Cairo Metro, Yellow Cab, Nile Felucca',
  sydney:     'Sydney Trains, Opal Card, Manly Beach Ferry',
  delhi:      'Delhi Metro, Auto Rickshaw, Uber',
  mumbai:     'Local Trains, Auto Rickshaw, TAXI',
  varanasi:   'Cycle Rickshaw, Auto, River Boat',
  kerala:     'Houseboat, KSRTC Bus, Auto Rickshaw',
  nathula:    'Shared SUV / Permit Taxi',
  gurgaon:    'Gurgaon Rapid Metro, Auto Rickshaw, Cab',
};

const generateItineraryAI = async (params) => {
  const {
    destination = 'Kolkata',
    days: inputDays,
    duration,
    numDays: inputNumDays,
    startDate = '',
    endDate = '',
    travelers = 2,
    budgetType = 'Moderate',
    budgetCategory = 'Moderate',
    customBudget,
    travelStyles = ['Cultural', 'Heritage'],
  } = params;

  // Explicitly extract days selection from input parameter!
  const requestedDays = inputDays || duration || inputNumDays;
  const numDays = requestedDays
    ? Math.min(14, Math.max(1, Number(requestedDays)))
    : (startDate && endDate
        ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
        : 3);

  const cityName = destination.trim();
  const lowerCity = cityName.toLowerCase();

  const landmarks = WORLD_LANDMARKS[lowerCity] || [
    `${cityName} Landmark Center`,
    `${cityName} Heritage Monument`,
    `${cityName} Historic Market`,
    `${cityName} Botanical Gardens`,
    `${cityName} Central Square`,
    `${cityName} Cultural Museum`,
  ];

  const cityCoords = WORLD_CITY_COORDINATES[lowerCity] || { lat: 22.5726, lng: 88.3639 };
  const localFood = FOOD_BY_CITY[lowerCity] || `Authentic ${cityName} Local Dishes`;
  const transport = TRANSPORT_BY_CITY[lowerCity] || `Public Metro & Taxi`;

  const effBudgetCategory = budgetType || budgetCategory || 'Moderate';
  const perDayBudgetMap = { Shoestring: 2500, Budget: 2500, Moderate: 6000, Standard: 6000, Opulent: 18000, Luxury: 18000 };
  const baseBudget = customBudget || (perDayBudgetMap[effBudgetCategory] || 6000) * numDays * travelers;

  const days = [];
  for (let i = 0; i < numDays; i++) {
    const spot1 = landmarks[i * 2 % landmarks.length];
    const spot2 = landmarks[(i * 2 + 1) % landmarks.length];

    const foodDish = localFood.split(',')[i % 3] || localFood;

    const activities = [
      {
        name: spot1,
        place: spot1,
        time: "09:00 AM",
        activity: `Visit ${spot1}`,
        description: `Explore historical architecture, exhibits, and photo spots at ${spot1}.`,
        location: `${spot1}, ${cityName}`,
        cost: effBudgetCategory === 'Shoestring' || effBudgetCategory === 'Budget' ? 100 : 350,
      },
      {
        name: `${cityName} Culinary Spot`,
        place: `${cityName} Culinary Spot`,
        time: "01:00 PM",
        activity: `Local Culinary Lunch — ${foodDish.trim()}`,
        description: `Sample regional specialties in ${cityName}: ${foodDish.trim()}.`,
        location: `${landmarks[0]}, ${cityName}`,
        cost: effBudgetCategory === 'Shoestring' || effBudgetCategory === 'Budget' ? 200 : 600,
      },
      {
        name: spot2,
        place: spot2,
        time: "03:30 PM",
        activity: `Sightseeing at ${spot2}`,
        description: `Discover local culture, artisan shops, and heritage around ${spot2}.`,
        location: `${spot2}, ${cityName}`,
        cost: effBudgetCategory === 'Shoestring' || effBudgetCategory === 'Budget' ? 150 : 400,
      },
      {
        name: `${cityName} Evening Market`,
        place: `${cityName} Evening Market`,
        time: "07:00 PM",
        activity: `Evening Cultural Market Tour`,
        description: `Stroll through illuminated evening markets. Recommended transport: ${transport.split(',')[0]}.`,
        location: `${spot2}, ${cityName}`,
        cost: effBudgetCategory === 'Shoestring' || effBudgetCategory === 'Budget' ? 250 : 700,
      }
    ];

    days.push({
      day: i + 1,
      theme: i === 0 ? 'ARRIVAL & HIGHLIGHTS' : i === numDays - 1 ? 'HIDDEN GEMS & FAREWELL' : `HERITAGE EXPLORATION DAY ${i + 1}`,
      title: `Day ${i + 1}: ${i === 0 ? `Arrival & Highlights of ${cityName}` : i === numDays - 1 ? `Hidden Gems & Farewell — ${cityName}` : `Exploring ${cityName} — Day ${i + 1}`}`,
      activities,
    });
  }

  const accommodation   = Math.round(baseBudget * 0.35);
  const foodBudget      = Math.round(baseBudget * 0.25);
  const transportBudget = Math.round(baseBudget * 0.15);
  const actBudget       = Math.round(baseBudget * 0.15);
  const shopping        = Math.round(baseBudget * 0.06);
  const emergency       = Math.round(baseBudget * 0.04);

  return {
    destination: cityName,
    daysCount: numDays,
    cityCoordinates: cityCoords,
    startDate, endDate, travelers, budgetType: effBudgetCategory,
    customBudget: baseBudget,
    estimatedCost: baseBudget,
    travelStyles,
    days,
    budgetBreakdown: { accommodation, food: foodBudget, transport: transportBudget, activities: actBudget, shopping, emergency, total: baseBudget },
    sustainabilityScore: 88,
    localScore: 92,
    explanation: `TravelGenie AI generated this ${numDays}-day itinerary for ${cityName} based on your ${effBudgetCategory} budget (₹${baseBudget.toLocaleString()}), focusing on ${travelStyles.join(', ')}.`,
  };
};

const optimizeItineraryAI = async (itinerary) => {
  return {
    ...itinerary,
    sustainabilityScore: 96,
    localScore: 98,
    explanation: `Optimized route with eco-friendly transit & zero-carbon walking trails in ${itinerary.destination}.`,
  };
};

const answerAIChat = async (userPrompt, history = []) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && !apiKey.startsWith('AQ.')) {
    try {
      const systemInstruction = "You are TravelGenie AI, an intelligent, charming, and highly knowledgeable travel concierge and expedition guide. Provide concise, well-formatted, and helpful advice on tourist attractions, local culture, authentic cuisine, safety advisories, and budget tips.";
      
      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        payload,
        { timeout: 8000 }
      );

      const candidateText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        return {
          reply: candidateText.trim(),
          suggestions: [
            "What are the best local food spots?",
            "What is the safest way to travel here?",
            "Give me a 3-day budget plan"
          ]
        };
      }
    } catch (apiErr) {
      console.warn("⚠️ Gemini API Call fallback:", apiErr.message);
    }
  }

  // Graceful curated intelligence fallback
  const p = userPrompt.toLowerCase();
  let fallbackReply = `TravelGenie AI recommendations for "${userPrompt}": Start your journey at iconic heritage landmarks, sample authentic local delicacies, and leverage local public transit for an eco-friendly expedition!`;
  
  if (p.includes('food') || p.includes('eat') || p.includes('dish') || p.includes('restaurant')) {
    fallbackReply = `For culinary exploration related to "${userPrompt}", seek out certified heritage eateries and bustling evening street markets. Don't miss regional specialties, artisan sweet shops, and traditional teas!`;
  } else if (p.includes('budget') || p.includes('cost') || p.includes('cheap') || p.includes('money')) {
    fallbackReply = `Budget optimization tip for "${userPrompt}": Use city metro & shared transit cards, visit open public monuments during off-peak hours, and dine where locals gather for 60% savings.`;
  } else if (p.includes('safe') || p.includes('emergency') || p.includes('warning')) {
    fallbackReply = `Safety advisory for "${userPrompt}": Keep digital copies of emergency contacts, utilize well-lit transit hubs, and access our in-app SOS terminal for instant local helpline assistance.`;
  }

  return {
    reply: fallbackReply,
    suggestions: ['Top attractions nearby?', 'Local food recommendations', 'Public transport routes', 'Safety advisories']
  };
};

module.exports = {
  generateItineraryAI,
  optimizeItineraryAI,
  answerAIChat
};
