import React, { useState, useEffect } from 'react';
import { MapPin, Search, Compass, RefreshCw, Locate, Navigation, ExternalLink, Globe } from 'lucide-react';
import { nearbyService } from '../services/api';
import JourneyMap from '../components/JourneyMap';

const CATEGORIES = [
  { id: 'all', label: 'All Places', icon: '🌐' },
  { id: 'attractions', label: 'Attractions & Spots', icon: '🏛️' },
  { id: 'food', label: 'Restaurants & Cafes', icon: '🍲' },
  { id: 'transit', label: 'Bus & Metro Stations', icon: '🚌' },
  { id: 'emergency', label: 'Hospitals & Safety', icon: '🏥' },
];

const POPULAR_DESTINATIONS = [
  'Kolkata', 'Paris', 'Tokyo', 'Darjeeling', 'Goa', 'Jaipur', 'Rome', 'Bali', 'New York', 'Delhi', 'Mumbai', 'London'
];

export default function NearbyPage() {
  const [location, setLocation] = useState('Kolkata');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsPos, setGpsPos] = useState(null);
  const [locatingGps, setLocatingGps] = useState(false);

  const fetchNearbyData = async (queryLoc = location, cat = category) => {
    setLoading(true);
    try {
      const res = await nearbyService.getNearby({ location: queryLoc, category: cat });
      if (res.data.success) {
        setPlaces(res.data.places || []);
        setLocation(queryLoc);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyData('Kolkata', 'all');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNearbyData(searchQuery.trim(), category);
    }
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) return;
    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsPos({ lat: latitude, lng: longitude });
        const gpsStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setSearchQuery(gpsStr);
        fetchNearbyData(gpsStr, category);
        setLocatingGps(false);
      },
      () => setLocatingGps(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
            LOCATION DISCOVERY
          </span>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
            নিকটবর্তী অনুসন্ধান
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">
          Nearby Search & Points of Interest
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Find nearby heritage landmarks, restaurants, transit hubs, and emergency safety facilities around your destination or live GPS location.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nearby places by city or landmark (e.g. Paris, Kolkata, Tokyo)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
            />
          </div>

          <button
            type="button"
            onClick={handleUseGps}
            disabled={locatingGps}
            className="px-4 py-2.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-stone-800 font-bold text-xs hover:bg-[#e2dad0] flex items-center gap-1.5 transition-colors shrink-0"
          >
            {locatingGps ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c85a44]" /> : <Locate className="w-3.5 h-3.5 text-[#c85a44]" />}
            <span>{locatingGps ? 'GPS...' : 'Use My GPS'}</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50 shadow-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search Nearby</span>
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); fetchNearbyData(location, cat.id); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                category === cat.id
                  ? 'bg-[#c85a44] text-white border-[#c85a44] shadow-sm'
                  : 'bg-[#f2eee5] border-[#e2dad0] text-stone-700 hover:bg-[#e6e0d4]'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* World Try Destination Chips */}
        <div className="pt-2 border-t border-[#e2dad0] space-y-1.5">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Popular Preset Destinations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest}
                onClick={() => { setSearchQuery(dest); fetchNearbyData(dest, category); }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                  location.toLowerCase() === dest.toLowerCase()
                    ? 'bg-[#c85a44] text-white border-[#c85a44]'
                    : 'bg-[#f2eee5] border-[#e2dad0] text-stone-700 hover:bg-[#e6e0d4]'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <JourneyMap
        fromAddress={`Start ${location}`}
        toAddress={`${location} Center`}
        destinationName={location}
        waypoints={places}
        title={`Nearby Points of Interest: ${location}`}
        height="380px"
      />

      {/* Places List */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#c85a44] animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-900">Querying nearby places...</p>
        </div>
      ) : places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-white border border-[#e2dad0] shadow-sm hover:border-[#c85a44] transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#e2dad0] pb-2">
                  <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-wider bg-[#fff0ed] px-2 py-0.5 rounded-full">
                    {place.category || 'Spot'}
                  </span>
                  <span className="text-xs font-bold text-stone-600">
                    📍 {place.distance || '0.5 km'}
                  </span>
                </div>

                <h3 className="text-base font-heritage font-extrabold text-stone-900">{place.name}</h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{place.description || place.address}</p>
              </div>

              <div className="pt-2 border-t border-[#e2dad0] flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700">{place.rating ? `⭐ ${place.rating}` : 'Featured'}</span>

                <button
                  onClick={() => {
                    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', ' + location)}`;
                    window.open(gmapsUrl, '_blank');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-[#c85a44] hover:bg-[#fff0ed] font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#c85a44]" />
                  <span>Google Maps ↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <Compass className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-heritage font-bold text-stone-900">No nearby places found for "{location}"</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try searching for cities like Kolkata, Paris, Tokyo, Darjeeling, Goa, or Jaipur.
          </p>
        </div>
      )}

    </div>
  );
}
