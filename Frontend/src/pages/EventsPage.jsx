import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Tag, Search, RefreshCw, Bookmark, Sparkles, ExternalLink, Ticket } from 'lucide-react';
import { eventService } from '../services/api';

const POPULAR_CITIES = ['Kolkata', 'Paris', 'Tokyo', 'Darjeeling', 'Goa', 'Jaipur', 'Rome', 'Bali'];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState('Kolkata');
  const [searchCity, setSearchCity] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [savedEventIds, setSavedEventIds] = useState([]);

  const fetchEventsData = async (queryCity = city, cat = category) => {
    setLoading(true);
    try {
      const res = await eventService.getEvents({ city: queryCity, category: cat });
      if (res.data.success) {
        setEvents(res.data.events || []);
        setCity(queryCity);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData('Kolkata', 'All');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchEventsData(searchCity.trim(), category);
    }
  };

  const toggleSaveEvent = (id) => {
    setSavedEventIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
            LOCAL CULTURAL CALENDAR
          </span>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
            স্থানীয় উৎসব ও সাংস্কৃতিক সূচি
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">
          Local Festivals & Cultural Events
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Discover live music concerts, heritage fairs, artisan bazaars, and traditional festivals across world destinations.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Filter by city name..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
            />
          </div>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); fetchEventsData(city, e.target.value); }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none font-bold"
          >
            {['All', 'Festival', 'Music & Concerts', 'Cultural Fair', 'Food & Cuisine', 'Art & Theatre'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search Events</span>
          </button>
        </form>

        {/* City Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider self-center mr-1">Popular Cities:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => { setSearchCity(c); fetchEventsData(c, category); }}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                city.toLowerCase() === c.toLowerCase()
                  ? 'bg-[#c85a44] text-white border-[#c85a44]'
                  : 'bg-[#f2eee5] border-[#e2dad0] text-stone-700 hover:bg-[#e6e0d4]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid Display */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#c85a44] animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-900">Querying live cultural calendar...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt, idx) => {
            const isSaved = savedEventIds.includes(evt._id || idx);
            return (
              <div key={idx} className="p-5 rounded-3xl bg-white border border-[#e2dad0] shadow-sm hover:border-[#c85a44] transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-[#e2dad0]">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#c85a44] text-white text-[10px] font-bold uppercase tracking-wider">
                      {evt.category || 'Cultural Event'}
                    </span>
                    <button
                      onClick={() => toggleSaveEvent(evt._id || idx)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                        isSaved ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-stone-900/70 text-white border-white/20'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-heritage font-extrabold text-stone-900">{evt.title}</h3>
                    <p className="text-xs text-[#c85a44] font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {evt.venue || evt.location || evt.city}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{evt.description}</p>
                </div>

                <div className="pt-3 border-t border-[#e2dad0] flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-stone-900">
                    Cost: <strong className="text-[#c85a44]">{evt.estimatedCost?.toLocaleString ? `₹${evt.estimatedCost.toLocaleString()}` : 'Free Entry'}</strong>
                  </span>

                  <button className="px-4 py-2 rounded-xl bg-[#19232d] text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5 text-[#d96b52]" />
                    <span>Get Passes</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <CalendarDays className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-heritage font-bold text-stone-900">No events found for "{city}"</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try filtering for popular cities like Kolkata, Paris, Tokyo, Darjeeling, Goa, or Jaipur.
          </p>
        </div>
      )}

    </div>
  );
}
