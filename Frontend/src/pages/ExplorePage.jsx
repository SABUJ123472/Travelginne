import React, { useState, useEffect } from 'react';
import { Compass, Search, Star, MapPin, Calendar, BookOpen, Sparkles, Check, Bookmark, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { destinationService } from '../services/api';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxBudget, setMaxBudget] = useState(1000);
  const [selectedDest, setSelectedDest] = useState(null);
  const [savedEventIds, setSavedEventIds] = useState([]);

  useEffect(() => {
    destinationService.getDestinations({ search, category }).then(res => {
      if (res.data.success) setDestinations(res.data.destinations || []);
    }).catch(() => {});
  }, [search, category]);

  const toggleSaveEvent = (eventId) => {
    setSavedEventIds(prev => 
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const filtered = destinations.filter(d => d.estimatedCost <= maxBudget || maxBudget >= 1000);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
            HERITAGE & DISCOVERY
          </span>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
            দর্শনীয় স্থান ও ঐতিহাসিক তথ্য
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">Explore Destinations</h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Discover iconic heritage sites, historical lore, offbeat hidden gems, and live local cultural events across world destinations.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by landmark or city..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-stone-700 shrink-0 uppercase tracking-wider">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52] font-bold"
            >
              {['All', 'Heritage', 'Nature', 'Food', 'Shopping', 'Culture', 'Hidden Gem'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Budget Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-stone-700">
              <span>Max Entry Fee:</span>
              <span className="text-[#c85a44] font-mono">₹{maxBudget >= 1000 ? 'Any' : maxBudget}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#c85a44] cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dest, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-white border border-[#e2dad0] shadow-sm hover:border-[#c85a44] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-[#e2dad0]">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/80 text-amber-300 text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {dest.rating}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-[#c85a44] text-white text-[10px] font-bold uppercase tracking-wider">
                  {dest.category}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-heritage font-extrabold text-stone-900">{dest.name}</h3>
                <p className="text-xs text-[#c85a44] font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {dest.location}
                </p>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{dest.description}</p>
            </div>

            <div className="pt-3 border-t border-[#e2dad0] flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-stone-900">
                Entry: <strong className="text-[#c85a44]">₹{dest.estimatedCost || 0}</strong>
              </span>

              <button
                onClick={() => setSelectedDest(dest)}
                className="px-4 py-2 rounded-xl bg-[#19232d] text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm"
              >
                Inspect Spot
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#e2dad0] p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest block">DESTINATION SPECIFICATIONS</span>
                <h3 className="text-xl font-heritage font-extrabold text-stone-900">{selectedDest.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDest(null)}
                className="px-3 py-1 rounded-xl bg-[#f5efe6] text-xs font-bold text-stone-700 hover:bg-[#e2dad0]"
              >
                Close
              </button>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#e2dad0]">
              <img src={selectedDest.image} alt={selectedDest.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-[#f5efe6] border border-[#e2dad0] space-y-1">
                <strong className="text-stone-900 font-bold block">About This Location:</strong>
                <p className="text-stone-600 leading-relaxed">{selectedDest.description}</p>
              </div>

              {selectedDest.history && (
                <div className="p-4 rounded-xl bg-[#c3dec9] border border-[#a8caa7] text-[#1e3b23] space-y-1">
                  <strong className="block font-bold flex items-center gap-1.5 text-[#142918]">
                    <BookOpen className="w-4 h-4 text-[#2b5934]" /> Heritage Lore & Historical Fact
                  </strong>
                  <p className="italic text-[11px] leading-relaxed">{selectedDest.history}</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Est. Entry Fee</span>
                  <strong className="text-stone-900 text-sm font-bold">₹{selectedDest.estimatedCost || 0}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Best Time</span>
                  <strong className="text-stone-900 text-xs font-bold">{selectedDest.bestTime || 'Morning'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Rating</span>
                  <strong className="text-[#c85a44] text-xs font-bold">⭐ {selectedDest.rating || 4.8} / 5.0</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedDest(null);
                  navigate(`/planner?city=${encodeURIComponent(selectedDest.location || selectedDest.name)}`);
                }}
                className="w-full py-3 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Plan Expedition to {selectedDest.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
