import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Sparkles, RefreshCw, Bookmark, Share2, MapPin, Compass, ShieldCheck, Landmark } from 'lucide-react';
import { destinationService } from '../services/api';

const FEATURED_CITIES = [
  'All Cities', 'Kolkata', 'Delhi', 'Mumbai', 'Jaipur', 'Goa', 'Darjeeling', 'Varanasi', 'Nathula', 'Gurgaon',
  'Paris', 'London', 'Tokyo', 'Rome', 'Barcelona', 'Amsterdam', 'Bali', 'Dubai', 'Istanbul', 'Cairo', 'New York'
];

export default function CultureStoriesPage() {
  const [stories, setStories] = useState([]);
  const [city, setCity] = useState('All Cities');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const fetchCultureStories = async (queryCity = city) => {
    setLoading(true);
    const targetCity = queryCity === 'All Cities' ? '' : queryCity;
    try {
      const res = await destinationService.getCultureStories({ city: targetCity });
      if (res.data.success) {
        setStories(res.data.stories || []);
        setCity(queryCity);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCultureStories('All Cities');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchCultureStories(searchCity.trim());
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
            HERITAGE & TRADITIONS
          </span>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
            ঐতিহ্য ও লোককথা
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">
          Local Culture Stories & Heritage Archives
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Cataloging historical lore, traditional craft legacies, folklore, and local heritage across world destinations.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Explore culture & history by city name (e.g. Kolkata, Paris, Tokyo, London, Jaipur, Bali)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50 shadow-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Fetch Stories</span>
          </button>
        </form>

        {/* City Presets */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Explore Culture Archives by City:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FEATURED_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => { setSearchCity(c === 'All Cities' ? '' : c); fetchCultureStories(c); }}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                  city.toLowerCase() === c.toLowerCase()
                    ? 'bg-[#c85a44] text-white border-[#c85a44] shadow-sm'
                    : 'bg-[#f2eee5] border-[#e2dad0] text-stone-700 hover:bg-[#e6e0d4]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#c85a44] animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-900">Accessing culture & heritage archives for {city}...</p>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-[#e2dad0] shadow-sm hover:border-[#c85a44] transition-all space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
                  <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
                    {story.period || 'HERITAGE ERA'}
                  </span>
                  <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c85a44]" /> {story.destination || city}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-heritage font-extrabold text-stone-900">{story.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2 line-clamp-4 font-medium">{story.story}</p>
                </div>
              </div>

              {/* Cultural Traditions Box */}
              {story.tradition && (
                <div className="p-4 rounded-xl bg-[#c3dec9] border border-[#a8caa7] text-xs text-[#1e3b23] space-y-1">
                  <strong className="flex font-bold items-center gap-1.5 text-[#142918]">
                    <BookOpen className="w-3.5 h-3.5 text-[#2b5934]" /> Local Traditions & Culinary Customs
                  </strong>
                  <p className="italic text-[11px] leading-relaxed">
                    "{story.tradition}"
                  </p>
                </div>
              )}

              {/* Cultural Etiquette Box */}
              {story.etiquette && (
                <div className="p-3.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0] text-xs text-stone-800 space-y-1">
                  <strong className="flex font-bold items-center gap-1.5 text-stone-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c85a44]" /> Traveler Etiquette Guide
                  </strong>
                  <p className="text-[11px] leading-relaxed text-stone-600 font-medium">
                    {story.etiquette}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedStory(story)}
                  className="px-4 py-2 rounded-xl bg-[#19232d] text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm"
                >
                  Read Full Lore Archive
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-heritage font-bold text-stone-900">No culture stories found for "{city}"</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try searching for popular heritage destinations like Kolkata, Paris, Tokyo, Darjeeling, Goa, or Jaipur.
          </p>
        </div>
      )}

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white border border-[#e2dad0] p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest block">{selectedStory.period || 'HERITAGE ERA'}</span>
                <h3 className="text-xl font-heritage font-extrabold text-stone-900">{selectedStory.title}</h3>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="px-3 py-1 rounded-xl bg-[#f5efe6] text-xs font-bold text-stone-700 hover:bg-[#e2dad0]"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-stone-800 leading-relaxed font-medium text-sm">{selectedStory.story}</p>
              
              {selectedStory.tradition && (
                <div className="p-4 rounded-xl bg-[#c3dec9] border border-[#a8caa7] text-[#1e3b23] space-y-1">
                  <strong className="flex font-bold items-center gap-1.5 text-[#142918]">
                    <BookOpen className="w-4 h-4 text-[#2b5934]" /> Local Traditions & Cultural Customs
                  </strong>
                  <p className="italic text-[11px] leading-relaxed">
                    "{selectedStory.tradition}"
                  </p>
                </div>
              )}

              {selectedStory.etiquette && (
                <div className="p-4 rounded-xl bg-[#f5efe6] border border-[#e2dad0] space-y-1">
                  <strong className="flex font-bold items-center gap-1.5 text-stone-900">
                    <ShieldCheck className="w-4 h-4 text-[#c85a44]" /> Traveler Etiquette & Local Respect
                  </strong>
                  <p className="text-stone-600 font-medium leading-relaxed">
                    {selectedStory.etiquette}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
