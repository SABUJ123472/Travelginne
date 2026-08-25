const axios = require('axios');

// City → available transport modes database
const CITY_TRANSPORT_PROFILES = {
  // Indian Cities
  kolkata:   { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: true,  tram: true,  boat: false },
  delhi:     { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: true,  train: true,  rickshaw: true,  tram: false, boat: false },
  mumbai:    { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: true  },
  jaipur:    { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: true,  train: true,  rickshaw: true,  tram: false, boat: false },
  goa:       { metro: false, bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: true  },
  varanasi:  { metro: false, bus: true,  taxi: true,  ferry: false, tuk_tuk: true,  train: true,  rickshaw: true,  tram: false, boat: true  },
  agra:      { metro: false, bus: true,  taxi: true,  ferry: false, tuk_tuk: true,  train: true,  rickshaw: true,  tram: false, boat: false },
  bangalore: { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },
  chennai:   { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },
  hyderabad: { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },
  pune:      { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },
  darjeeling:{ metro: false, bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },

  // Global Cities
  paris:     { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: true,  boat: true  },
  tokyo:     { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },
  london:    { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: true,  boat: true  },
  rome:      { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: true,  boat: false },
  barcelona: { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: true,  boat: true  },
  istanbul:  { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: true,  boat: true  },
  dubai:     { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: false, rickshaw: false, tram: false, boat: true  },
  singapore: { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },
  bangkok:   { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: true,  train: true,  rickshaw: false, tram: false, boat: true  },
  bali:      { metro: false, bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: false, rickshaw: false, tram: false, boat: true  },
  cairo:     { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },
  sydney:    { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: true,  boat: true  },
  'new york':{ metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: true  },
  amsterdam: { metro: true,  bus: true,  taxi: true,  ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: true,  boat: true  },
  venice:    { metro: false, bus: false, taxi: false, ferry: true,  tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: true  },
  prague:    { metro: true,  bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: true,  boat: false },
  kyoto:     { metro: false, bus: true,  taxi: true,  ferry: false, tuk_tuk: false, train: true,  rickshaw: false, tram: false, boat: false },
};

// Cost table per km
const COST_PER_KM = {
  metro:    { base: 15, perKm: 2.5,  currency: '₹', icon: 'Train' },
  tram:     { base: 10, perKm: 2,    currency: '₹', icon: 'Train' },
  bus:      { base: 12, perKm: 1.5,  currency: '₹', icon: 'Bus'   },
  taxi:     { base: 50, perKm: 18,   currency: '₹', icon: 'Car'   },
  train:    { base: 20, perKm: 2,    currency: '₹', icon: 'Train' },
  ferry:    { base: 25, perKm: 5,    currency: '₹', icon: 'Ship'  },
  boat:     { base: 30, perKm: 6,    currency: '₹', icon: 'Ship'  },
  tuk_tuk:  { base: 20, perKm: 10,   currency: '₹', icon: 'Car'   },
  rickshaw: { base: 15, perKm: 8,    currency: '₹', icon: 'Bus'   },
};

const SPEED_KMH = {
  metro: 40, tram: 25, bus: 22, taxi: 30, train: 50,
  ferry: 20, boat: 15, tuk_tuk: 20, rickshaw: 12,
};

const MODE_META = {
  metro:    (from, to) => ({
    mode: 'Metro / Subway',
    badge: 'Fastest & Eco-Friendly',
    description: `Ride the underground metro network from near ${from} to ${to}. Fast, air-conditioned, and avoids road congestion.`,
  }),
  tram:     (from, to) => ({
    mode: 'Tram / Streetcar',
    badge: 'Scenic City Ride',
    description: `Hop on a city tram running between ${from} and ${to}. Great for shorter distances with frequent stops.`,
  }),
  bus:      (from, to) => ({
    mode: 'Public Bus',
    badge: 'Most Affordable',
    description: `City buses run frequently along major routes. Board near ${from} heading toward ${to}.`,
  }),
  taxi:     (from, to) => ({
    mode: 'Taxi / Rideshare',
    badge: 'Door-to-Door Comfort',
    description: `Book a taxi or app-cab (Uber/Ola/local equivalent) directly from ${from} to ${to}. Best for luggage and comfort.`,
  }),
  train:    (from, to) => ({
    mode: 'Local / Regional Train',
    badge: 'Long-Distance Option',
    description: `Use the local rail or suburban train network connecting ${from} to the area around ${to}.`,
  }),
  ferry:    (from, to) => ({
    mode: 'Ferry / Water Transport',
    badge: 'Scenic Waterway Route',
    description: `A river or coastal ferry service connects areas near ${from} and ${to}. Unique experience across waterways.`,
  }),
  boat:     (from, to) => ({
    mode: 'Boat / Water Taxi',
    badge: 'Island & Coastal Route',
    description: `Local water taxis or motorboats are a common way to travel near ${from}. Perfect for coastal destinations.`,
  }),
  tuk_tuk:  (from, to) => ({
    mode: 'Tuk-Tuk / Auto Rickshaw',
    badge: 'Local Favourite',
    description: `Hail a tuk-tuk or auto rickshaw for a fun, authentic short trip from ${from} to ${to}.`,
  }),
  rickshaw: (from, to) => ({
    mode: 'Cycle Rickshaw',
    badge: 'Old City Charm',
    description: `Cycle rickshaws are ideal for navigating narrow lanes and markets between ${from} and ${to}.`,
  }),
};

// Geocode a location using Nominatim (primary, free) with LocationIQ as fallback
const geocode = async (location) => {
  // 1. Nominatim — free, no rate limit
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: location, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'TravelGenieApp/1.0' },
      timeout: 5000,
    });
    if (res.data?.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lon: parseFloat(res.data[0].lon),
        displayName: res.data[0].display_name,
        provider: 'OpenStreetMap Nominatim'
      };
    }
  } catch (e) {}

  // 2. LocationIQ Fallback (rate-limited — only if Nominatim fails)
  const locIQKey = process.env.LOCATIONIQ_API_KEY;
  if (locIQKey && locIQKey !== 'your_locationiq_key') {
    try {
      const url = `https://us1.locationiq.com/v1/search?key=${locIQKey}&q=${encodeURIComponent(location)}&format=json&limit=1`;
      const res = await axios.get(url, { timeout: 4000 });
      if (res.data && res.data.length > 0) {
        return {
          lat: parseFloat(res.data[0].lat),
          lon: parseFloat(res.data[0].lon),
          displayName: res.data[0].display_name,
          provider: 'LocationIQ Geocoding API'
        };
      }
    } catch (e) {
      console.warn('LocationIQ Geocoding note:', e.message);
    }
  }

  return null;
};

// LocationIQ Directions Routing API
const getLocationIQDirections = async (lat1, lon1, lat2, lon2) => {
  const locIQKey = process.env.LOCATIONIQ_API_KEY;
  if (!locIQKey || locIQKey === 'your_locationiq_key') return null;

  try {
    const url = `https://us1.locationiq.com/v1/directions/driving/${lon1},${lat1};${lon2},${lat2}?key=${locIQKey}&steps=true&geometries=geojson`;
    const res = await axios.get(url, { timeout: 4500 });
    if (res.data && res.data.routes && res.data.routes[0]) {
      const routeData = res.data.routes[0];
      return {
        distanceKm: Math.round((routeData.distance / 1000) * 10) / 10,
        durationMins: Math.round(routeData.duration / 60),
        geometry: routeData.geometry,
        provider: 'LocationIQ Directions Routing API'
      };
    }
  } catch (e) {
    console.warn('LocationIQ Directions note:', e.message);
  }
  return null;
};

// Haversine formula — straight-line distance in km
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const detectCity = (from, to) => {
  const combined = `${from} ${to}`.toLowerCase();
  for (const city of Object.keys(CITY_TRANSPORT_PROFILES)) {
    if (combined.includes(city)) return city;
  }
  if (combined.match(/france|paris|lyon/)) return 'paris';
  if (combined.match(/japan|tokyo|osaka|kyoto/)) return 'tokyo';
  if (combined.match(/london|uk|england/)) return 'london';
  if (combined.match(/italy|rome|milan/)) return 'rome';
  if (combined.match(/dubai|uae/)) return 'dubai';
  if (combined.match(/bali|indonesia/)) return 'bali';
  if (combined.match(/bangkok|thailand/)) return 'bangkok';
  if (combined.match(/goa|panaji|panjim/)) return 'goa';
  if (combined.match(/varanasi|benares/)) return 'varanasi';
  if (combined.match(/jaipur|rajasthan/)) return 'jaipur';
  if (combined.match(/kolkata|calcutta|howrah/)) return 'kolkata';
  if (combined.match(/delhi|new delhi/)) return 'delhi';
  if (combined.match(/mumbai|bombay/)) return 'mumbai';
  return null;
};

const GENERIC_PROFILE = { metro: false, bus: true, taxi: true, ferry: false, tuk_tuk: false, train: true, rickshaw: false, tram: false, boat: false };

const getTransportOptions = async (from, to) => {
  // 1. Geocode locations with LocationIQ
  const [geoFrom, geoTo] = await Promise.all([geocode(from), geocode(to)]);

  let roadDistanceKm = null;
  let directionsData = null;

  if (geoFrom && geoTo) {
    // Try real LocationIQ Driving Directions API
    directionsData = await getLocationIQDirections(geoFrom.lat, geoFrom.lon, geoTo.lat, geoTo.lon);
    if (directionsData) {
      roadDistanceKm = directionsData.distanceKm;
    } else {
      const dist = haversine(geoFrom.lat, geoFrom.lon, geoTo.lat, geoTo.lon);
      roadDistanceKm = Math.round(dist * 1.35 * 10) / 10;
    }
  }

  const cityKey = detectCity(from, to);
  const profile = cityKey ? CITY_TRANSPORT_PROFILES[cityKey] : GENERIC_PROFILE;
  const availableModes = Object.entries(profile).filter(([, val]) => val).map(([m]) => m);

  const km = roadDistanceKm || 8;

  const filteredModes = availableModes.filter(mode => {
    if (mode === 'rickshaw' && km > 5) return false;
    return true;
  });

  const options = filteredModes.map(mode => {
    const cost = COST_PER_KM[mode];
    const speed = SPEED_KMH[mode];
    const meta = MODE_META[mode];
    if (!cost || !speed || !meta) return null;

    const estimatedMinutes = Math.round((km / speed) * 60);
    const estimatedCost = Math.round(cost.base + cost.perKm * km);
    const { mode: label, badge, description } = meta(from, to);

    return {
      mode: label,
      estimatedTime: estimatedMinutes < 60
        ? `${estimatedMinutes} mins`
        : `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`,
      estimatedCost,
      currency: cost.currency,
      transfers: (mode === 'metro' || mode === 'train') ? 1 : 0,
      badge,
      isFastest: false,
      isBestBudget: false,
      description,
      icon: cost.icon,
      modeKey: mode,
    };
  }).filter(Boolean);

  if (options.length === 0) {
    options.push({
      mode: 'Taxi / Rideshare',
      estimatedTime: `${Math.round((km / 30) * 60)} mins`,
      estimatedCost: Math.round(50 + 18 * km),
      currency: '₹',
      transfers: 0,
      badge: 'Door-to-Door Comfort',
      isFastest: true,
      isBestBudget: false,
      description: `Book a local taxi or rideshare app from ${from} to ${to}.`,
      icon: 'Car',
    });
  }

  const sortedByTime = [...options].sort((a, b) => parseInt(a.estimatedTime) - parseInt(b.estimatedTime));
  const sortedByCost = [...options].sort((a, b) => a.estimatedCost - b.estimatedCost);
  options.forEach(opt => {
    if (opt.mode === sortedByTime[0].mode) opt.isFastest = true;
    if (opt.mode === sortedByCost[0].mode) opt.isBestBudget = true;
  });

  return {
    from,
    to,
    distanceKm: roadDistanceKm,
    geocodedFrom: geoFrom?.displayName || from,
    geocodedTo: geoTo?.displayName || to,
    fromCoords: geoFrom ? { lat: geoFrom.lat, lng: geoFrom.lon } : null,
    toCoords: geoTo ? { lat: geoTo.lat, lng: geoTo.lon } : null,
    city: cityKey || 'Unknown',
    options,
    provider: geoFrom?.provider || 'LocationIQ API'
  };
};

module.exports = { getTransportOptions };
