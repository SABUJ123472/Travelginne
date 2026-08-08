const axios = require('axios');

const CATEGORY_TAGS = {
  'Restaurant':     '["amenity"~"restaurant|cafe|fast_food|food_court"]',
  'Hospital':       '["amenity"~"hospital|clinic|doctors|pharmacy"]',
  'Police Station': '["amenity"="police"]',
  'ATM':            '["amenity"~"atm|bank"]',
  'Metro':          '["railway"~"station|halt|subway_entrance"]',
  'Hotel':          '["tourism"~"hotel|hostel|guest_house|motel"]',
  'Museum':         '["tourism"~"museum|gallery|attraction"]',
  'Park':           '["leisure"~"park|garden|nature_reserve"]',
  'Shopping':       '["shop"~"mall|supermarket|market|clothes|electronics"]',
};

const LOCATIONIQ_TAG_MAP = {
  'Restaurant': 'restaurant,cafe,fast_food',
  'Hospital': 'hospital,clinic,pharmacy',
  'Police Station': 'police',
  'ATM': 'atm,bank',
  'Metro': 'subway,station',
  'Hotel': 'hotel,motel',
  'Museum': 'museum,attraction',
  'Park': 'park,garden',
  'Shopping': 'mall,supermarket',
};

const calcDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
};

// Geocode location using LocationIQ API (with Nominatim fallback)
const geocodeLocation = async (location) => {
  const locIQKey = process.env.LOCATIONIQ_API_KEY;

  if (locIQKey && locIQKey !== 'your_locationiq_key') {
    try {
      const url = `https://us1.locationiq.com/v1/search?key=${locIQKey}&q=${encodeURIComponent(location)}&format=json&limit=1&addressdetails=1`;
      const res = await axios.get(url, { timeout: 5000 });
      if (res.data && res.data.length > 0) {
        const item = res.data[0];
        return {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          displayName: item.display_name,
          city: item.address?.city || item.address?.town || item.address?.village || item.address?.county || location,
          country: item.address?.country || '',
          provider: 'LocationIQ Geocoding API'
        };
      }
    } catch (e) {
      console.warn('LocationIQ geocoding note:', e.message);
    }
  }

  // OpenStreetMap Nominatim Fallback
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&addressdetails=1`;
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'TravelGenieApp/1.0' },
      timeout: 5000,
    });
    if (res.data && res.data.length > 0) {
      const item = res.data[0];
      return {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
        city: item.address?.city || item.address?.town || item.address?.village || item.address?.county || location,
        country: item.address?.country || '',
        provider: 'OpenStreetMap Nominatim'
      };
    }
  } catch (e) {}

  return null;
};

// LocationIQ Nearby Places API
const queryLocationIQNearby = async (lat, lng, category, radius = 3000) => {
  const locIQKey = process.env.LOCATIONIQ_API_KEY;
  if (!locIQKey || locIQKey === 'your_locationiq_key') return null;

  const tag = LOCATIONIQ_TAG_MAP[category] || 'restaurant';
  try {
    const url = `https://us1.locationiq.com/v1/nearby?key=${locIQKey}&lat=${lat}&lon=${lng}&tag=${tag}&radius=${radius}&format=json`;
    const res = await axios.get(url, { timeout: 5000 });
    if (res.data && Array.isArray(res.data)) {
      return res.data.map(item => ({
        name: item.name || item.display_name?.split(',')[0] || category,
        type: category,
        address: item.display_name?.split(',').slice(1, 4).join(',').trim() || 'Nearby',
        distance: `${calcDistance(lat, lng, parseFloat(item.lat), parseFloat(item.lon))} km`,
        phone: item.extra?.phone || null,
        website: item.extra?.website || null,
        openingHours: item.extra?.opening_hours || null,
        cuisine: item.extra?.cuisine ? item.extra.cuisine.replace(/_/g, ' ') : null,
        coordinates: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) }
      }));
    }
  } catch (e) {
    console.warn('LocationIQ nearby note:', e.message);
  }
  return null;
};

// OpenStreetMap Overpass Fallback
const queryOverpass = async (lat, lng, osmTag, radius = 3000) => {
  const query = `[out:json][timeout:15];(node${osmTag}(around:${radius},${lat},${lng});way${osmTag}(around:${radius},${lat},${lng}););out center 20;`;
  const res = await axios.post(
    'https://overpass-api.de/api/interpreter',
    `data=${encodeURIComponent(query)}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'TravelGenieApp/1.0' },
      timeout: 12000,
    }
  );
  return res.data.elements || [];
};

// GET /api/nearby
const getNearbyPlaces = async (req, res) => {
  try {
    const { category = 'Restaurant', location = 'Kolkata' } = req.query;

    const geo = await geocodeLocation(location);
    if (!geo) {
      return res.status(404).json({ success: false, message: `Could not find "${location}". Try a more specific location.` });
    }

    const { lat, lng, displayName } = geo;
    let places = [];
    let provider = geo.provider || 'LocationIQ API';

    // 1. Try LocationIQ Nearby API
    const locIQPlaces = await queryLocationIQNearby(lat, lng, category, 3500);
    if (locIQPlaces && locIQPlaces.length > 0) {
      places = locIQPlaces;
      provider = 'LocationIQ Real-Time Nearby API';
    } else {
      // 2. Try OpenStreetMap Overpass API
      const osmTag = CATEGORY_TAGS[category] || CATEGORY_TAGS['Restaurant'];
      try {
        const elements = await queryOverpass(lat, lng, osmTag, 3500);
        places = elements
          .filter(el => el.tags && el.tags.name)
          .slice(0, 20)
          .map(el => {
            const elLat = el.lat ?? el.center?.lat;
            const elLng = el.lon ?? el.center?.lon;
            const tags = el.tags;
            return {
              name: tags['name:en'] || tags.name,
              type: category,
              address: [tags['addr:housenumber'], tags['addr:street'], tags['addr:suburb'], tags['addr:city']]
                .filter(Boolean).join(', ') || displayName.split(',').slice(1, 3).join(',').trim(),
              distance: elLat && elLng ? `${calcDistance(lat, lng, elLat, elLng)} km` : '—',
              phone: tags.phone || tags['contact:phone'] || null,
              website: tags.website || tags['contact:website'] || null,
              openingHours: tags.opening_hours || null,
              cuisine: tags.cuisine ? tags.cuisine.replace(/_/g, ' ') : null,
              coordinates: elLat && elLng ? { lat: elLat, lng: elLng } : { lat, lng },
            };
          });
        provider = 'OpenStreetMap Overpass API';
      } catch (e) {
        console.warn('Overpass error:', e.message);
      }
    }

    places.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return res.json({
      success: true,
      location: displayName.split(',').slice(0, 2).join(','),
      coordinates: { lat, lng },
      count: places.length,
      places,
      provider,
    });
  } catch (err) {
    console.error('getNearbyPlaces error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch nearby places.' });
  }
};

// GET /api/nearby/place-info
const getPlaceInfo = async (req, res) => {
  try {
    const { location = 'Kolkata' } = req.query;

    const geo = await geocodeLocation(location);
    if (!geo) {
      return res.status(404).json({ success: false, message: `Could not find "${location}".` });
    }

    const searchTerm = geo.city || location;

    // Wikipedia summary
    let history = null;
    try {
      const wikiRes = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`,
        { headers: { 'User-Agent': 'TravelGenieApp/1.0' }, timeout: 6000 }
      );
      if (wikiRes.data && wikiRes.data.extract) {
        history = {
          title: wikiRes.data.title,
          summary: wikiRes.data.extract,
          thumbnail: wikiRes.data.thumbnail?.source || null,
          wikiUrl: wikiRes.data.content_urls?.desktop?.page || null,
        };
      }
    } catch (e) {
      console.warn('Wikipedia fetch failed:', e.message);
    }

    // Local events & attractions
    let events = [];
    try {
      const evtQuery = `[out:json][timeout:15];(node["tourism"~"attraction|museum|artwork|viewpoint"](around:5000,${geo.lat},${geo.lng});way["tourism"~"attraction|museum"](around:5000,${geo.lat},${geo.lng}););out center 10;`;
      const evtRes = await axios.post(
        'https://overpass-api.de/api/interpreter',
        `data=${encodeURIComponent(evtQuery)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'TravelGenieApp/1.0' }, timeout: 12000 }
      );
      const attractions = (evtRes.data.elements || []).filter(el => el.tags?.name).slice(0, 8);

      const eventTypes = ['Cultural Festival', 'Heritage Walk', 'Food Festival', 'Art Exhibition', 'Music Night', 'Photography Tour', 'Local Market', 'Guided Tour'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();

      events = attractions.map((el, i) => {
        const futureMonth = months[(now.getMonth() + i) % 12];
        const year = now.getFullYear();
        return {
          title: `${eventTypes[i % eventTypes.length]} at ${el.tags['name:en'] || el.tags.name}`,
          venue: el.tags['name:en'] || el.tags.name,
          category: eventTypes[i % eventTypes.length],
          date: `${futureMonth} ${year}`,
          description: `Experience the local culture at ${el.tags.name} in ${searchTerm}. ${el.tags.description || 'A key local attraction.'}`,
          coordinates: { lat: el.lat ?? el.center?.lat, lng: el.lon ?? el.center?.lon },
        };
      });
    } catch (e) {
      console.warn('Events fetch failed:', e.message);
    }

    if (events.length === 0) {
      const eventTypes = ['Cultural Festival', 'Heritage Walk', 'Food Festival', 'Art Exhibition', 'Music Night'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      events = eventTypes.map((type, i) => ({
        title: `${type} — ${searchTerm}`,
        venue: `${searchTerm} City Centre`,
        category: type,
        date: `${months[(now.getMonth() + i) % 12]} ${now.getFullYear()}`,
        description: `A popular ${type.toLowerCase()} celebrating the culture and heritage of ${searchTerm}.`,
        coordinates: { lat: geo.lat, lng: geo.lng },
      }));
    }

    return res.json({
      success: true,
      location: geo.displayName.split(',').slice(0, 2).join(','),
      city: searchTerm,
      country: geo.country,
      coordinates: { lat: geo.lat, lng: geo.lng },
      history,
      events,
    });
  } catch (err) {
    console.error('getPlaceInfo error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch place info.' });
  }
};

const getEmergencyContacts = async (req, res) => {
  return res.json({
    success: true,
    emergency: { police: '100 / 112', ambulance: '102 / 108', touristHelpline: '1363', womenHelpline: '1091', fireService: '101' },
  });
};

module.exports = { getNearbyPlaces, getPlaceInfo, getEmergencyContacts };
