import React, { useState, useEffect } from 'react';
import {
  Gem, MapPin, ShieldCheck, Sparkles, BookOpen, ArrowRight,
  Search, RefreshCw, Navigation, Locate, X, Globe, Star, Bookmark, Plus, Map, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { destinationService } from '../services/api';
import JourneyMap from '../components/JourneyMap';

const CITY_PRESETS = [
  { city: 'All', icon: '🌐' },
  { city: 'Kolkata', icon: '🏛️' },
  { city: 'Paris', icon: '🗼' },
  { city: 'Tokyo', icon: '⛩️' },
  { city: 'Darjeeling', icon: '⛰️' },
  { city: 'Goa', icon: '🏖️' },
  { city: 'Jaipur', icon: '🏰' },
  { city: 'Rome', icon: '🏛️' },
  { city: 'Bali', icon: '🌴' },
];

export default function HiddenGemsPage() {
  const navigate = useNavigate();
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [selectedCityPreset, setSelectedCityPreset] = useState('All');

  // Navigation Modal State
  const [activeGemNav, setActiveGemNav] = useState(null);
  const [userGpsPos, setUserGpsPos] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [locatingGps, setLocatingGps] = useState(false);

  const fetchGems = async (cityQuery = searchCity) => {
    setLoading(true);
    try {
      const res = await destinationService.getHiddenGems(cityQuery);
      if (res.data.success) {
        setGems(res.data.hiddenGems || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGems();
  }, []);

  const handleCityPresetClick = (city) => {
    setSelectedCityPreset(city);
    if (city === 'All') {
      setSearchCity('');
      fetchGems('');
    } else {
      setSearchCity(city);
      fetchGems(city);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedCityPreset('Custom');
    fetchGems(searchCity);
  };

  // Open Route Navigation Modal
  const openNavigationModal = (gem) => {
    setActiveGemNav(gem);
    setUserGpsPos(null);
    setUserAddress('Locating your GPS position...');

    if (navigator.geolocation) {
      setLocatingGps(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserGpsPos({ lat: latitude, lng: longitude });
          setUserAddress(`GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setLocatingGps(false);
        },
        (err) => {
          setLocatingGps(false);
          setUserAddress(`${gem.city} City Center`);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  // Open External Google Maps Navigation
  const openGoogleMapsDirections = (gem) => {
    let originParam = '';
    if (userGpsPos?.lat && userGpsPos?.lng) {
      originParam = `&origin=${userGpsPos.lat},${userGpsPos.lng}`;
    }

    let destParam = '';
    if (gem.coordinates?.lat && gem.coordinates?.lng) {
      destParam = `destination=${gem.coordinates.lat},${gem.coordinates.lng}`;
    } else {
      destParam = `destination=${encodeURIComponent(gem.name + ', ' + gem.city)}`;
    }

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&${destParam}${originParam}`;
    window.open(gmapsUrl, '_blank');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header matching Google Stitch */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest block">
          OFF THE BEATEN PATH
        </span>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900 leading-tight">
          Discover Underrated & Hidden Gems
        </h1>
        <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
          Cataloging secret artisan hubs, ancient stepwells, mossy gothic cemeteries, and secluded forest coves across world destinations.
        </p>
      </div>

      {/* Filter Search Bar & Presets */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search hidden gems by city (e.g. Paris, Tokyo, Kolkata, Goa, Rome, Bali)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50 shadow-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search Gems</span>
          </button>
        </form>

        {/* City Filter Presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider self-center flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-[#c85a44]" /> Filter City:
          </span>
          {CITY_PRESETS.map((preset) => (
            <button
              key={preset.city}
              onClick={() => handleCityPresetClick(preset.city)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                selectedCityPreset === preset.city
                  ? 'bg-[#c85a44] text-white border-[#c85a44]'
                  : 'bg-[#f2eee5] border-[#e2dad0] text-stone-700 hover:bg-[#e6e0d4]'
              }`}
            >
              {preset.icon} {preset.city}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#c85a44] animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-900">Searching underrated hidden gems...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && gems.length === 0 && (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <Gem className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-heritage font-bold text-stone-900">No hidden gems found for "{searchCity}"</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try searching for cities like Kolkata, Paris, Tokyo, Darjeeling, Goa, Jaipur, Rome, or Bali.
          </p>
        </div>
      )}

      {/* Gems Cards Grid matching Google Stitch */}
      {!loading && gems.length > 0 && (
        <div className="space-y-8">
          {gems.map((gem, idx) => (
            <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-sm">
              
              {/* Image */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-72 border border-[#e2dad0]">
                <img src={gem.image} alt={gem.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#c85a44] text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  ARTISAN HUB
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-stone-900/80 text-white text-[11px] font-bold">
                  📍 {gem.city}
                </span>
              </div>

              {/* Card Details */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-heritage font-extrabold text-stone-900">{gem.name}</h3>
                  <p className="text-xs font-semibold text-[#c85a44] flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {gem.location}
                  </p>
                </div>

                {/* Special Reason */}
                <div className="p-3.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-xs text-stone-700">
                  <strong className="text-stone-900 font-bold block mb-1">✨ Why This Place Is Underrated & Special:</strong>
                  {gem.whySpecial || gem.description}
                </div>

                {/* Archival Local Lore Quote Box matching Google Stitch */}
                {gem.localStory && (
                  <div className="p-4 rounded-xl bg-[#c3dec9] border border-[#a8caa7] text-xs text-[#1e3b23] space-y-1">
                    <strong className="flex font-bold items-center gap-1.5 text-[#142918]">
                      <BookOpen className="w-3.5 h-3.5 text-[#2b5934]" /> Local Lore & Heritage
                    </strong>
                    <p className="italic text-[11px] leading-relaxed">{gem.localStory}</p>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">Crowd Level</span>
                    <span className="font-bold text-stone-900">{gem.crowdLevel || 'Low'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">Safety Level</span>
                    <span className="font-bold text-[#c85a44]">{gem.safetyLevel || 'Safe'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">Best Time</span>
                    <span className="font-bold text-stone-900 text-[11px]">{gem.bestTimeToVisit}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">Est. Cost</span>
                    <span className="font-bold text-stone-900 font-mono">₹{gem.estimatedCost}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => openNavigationModal(gem)}
                    className="px-5 py-2.5 rounded-xl bg-[#19232d] text-white font-bold text-xs flex items-center gap-2 hover:bg-stone-800 transition-colors shadow-sm"
                  >
                    <Navigation className="w-4 h-4 text-[#d96b52]" />
                    <span>Route Navigation from My Location</span>
                  </button>

                  <button
                    onClick={() => openGoogleMapsDirections(gem)}
                    className="px-4 py-2.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-stone-800 hover:bg-[#e2dad0] font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Map className="w-3.5 h-3.5 text-[#c85a44]" />
                    <span>Google Maps App ↗</span>
                  </button>

                  <button
                    onClick={() => navigate(`/planner?city=${encodeURIComponent(gem.city)}`)}
                    className="px-4 py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Include in AI Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GPS Navigation Route Modal */}
      {activeGemNav && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-3xl bg-white border border-[#e2dad0] p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest">Interactive Journey Navigation</span>
                <h3 className="text-xl font-heritage font-extrabold text-stone-900">
                  Route to {activeGemNav.name} ({activeGemNav.city})
                </h3>
              </div>
              <button
                onClick={() => setActiveGemNav(null)}
                className="p-1 rounded-full text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Starting Location Bar */}
            <div className="p-3.5 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Locate className="w-4 h-4 text-[#c85a44] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-[#c85a44] uppercase">MY CURRENT GPS POSITION</span>
                  <p className="text-stone-900 font-semibold">{locatingGps ? 'Fetching live GPS coordinates...' : userAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openGoogleMapsDirections(activeGemNav)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#c85a44] text-white hover:bg-[#a54431] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Voice GPS in Google Maps</span>
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Route Map */}
            <JourneyMap
              fromAddress={userAddress || 'My Location'}
              fromCoords={userGpsPos}
              toAddress={`${activeGemNav.name}, ${activeGemNav.city}`}
              toCoords={activeGemNav.coordinates}
              destinationName={activeGemNav.city}
              title={`Live Journey Route: My Location ➔ ${activeGemNav.name}`}
              height="440px"
            />

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => openGoogleMapsDirections(activeGemNav)}
                className="text-xs text-[#c85a44] font-bold hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Launch Turn-by-Turn Voice Navigation App</span>
              </button>

              <button
                onClick={() => setActiveGemNav(null)}
                className="px-6 py-2 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-stone-800 font-bold text-xs hover:bg-[#e2dad0]"
              >
                Close Navigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
