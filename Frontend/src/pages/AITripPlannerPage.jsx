import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles, MapPin, Calendar, Compass, RefreshCw, Bookmark, Check,
  Share2, ArrowRight, BookOpen, Navigation, Train, Bus, Save, Users,
  Wallet, Clock, DollarSign, Printer, ExternalLink, Map
} from 'lucide-react';
import { tripService } from '../services/api';
import JourneyMap from '../components/JourneyMap';

const CITY_PRESETS = [
  'Kolkata', 'Nathula', 'Gurgaon', 'Paris', 'Tokyo', 'Darjeeling', 'Goa', 'Jaipur', 'Rome', 'Bali'
];

const INTERESTS = [
  '🏛️ Heritage & Architecture',
  '🍲 Food & Culinary',
  '💎 Hidden Gems',
  '📷 Photography',
  '🌲 Nature & Outdoor',
  '🎭 Local Culture',
];

export default function AITripPlannerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [destination, setDestination] = useState(initialCity || 'Kolkata');
  const [days, setDays] = useState(3);
  const [budgetCategory, setBudgetCategory] = useState('Standard');
  const [travelers, setTravelers] = useState('2 Travelers');
  const [selectedInterests, setSelectedInterests] = useState(['🏛️ Heritage & Architecture', '💎 Hidden Gems']);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (item) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const getPlaceName = (act) => {
    if (act.place && act.place !== 'Heritage Landmark' && act.place !== 'Landmark Spot') return act.place;
    if (act.name && act.name !== 'Heritage Landmark' && act.name !== 'Landmark Spot') return act.name;
    if (act.activity) {
      const cleaned = act.activity.replace(/^(Visit|Sightseeing at|Exploration of|Check-in at)\s+/i, '');
      if (cleaned && cleaned !== 'Heritage Landmark') return cleaned;
    }
    if (act.description) {
      const match = act.description.match(/(?:at|around|around the|near|of)\s+([A-Z][a-zA-Z\s']+?)(?=\.|\,|$)/);
      if (match && match[1]) return match[1].trim();
    }
    return 'Landmark Destination';
  };

  const handleGenerate = async (e) => {
    e && e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setSaved(false);

    try {
      const res = await tripService.generateItinerary({
        destination: destination.trim(),
        days: Number(days),
        budgetCategory,
        travelers,
        interests: selectedInterests,
      });

      if (res.data.success) {
        setItinerary(res.data.itinerary);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!itinerary) return;
    setSaving(true);
    try {
      const res = await tripService.saveTrip({
        destination: itinerary.destination || destination,
        days: Number(days),
        budget: itinerary.estimatedCost || 20000,
        itinerary
      });
      if (res.data.success) {
        setSaved(true);
      }
    } catch (err) {
    } finally {
      setSaving(false);
    }
  };

  const openGoogleMapsSpot = (spotName) => {
    const targetCity = itinerary?.destination || destination;
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotName + ', ' + targetCity)}`;
    window.open(gmapsUrl, '_blank');
  };

  useEffect(() => {
    if (initialCity) {
      handleGenerate();
    }
  }, [initialCity]);

  return (
    <div className="space-y-10 pb-16">

      {/* Hero Section matching Google Stitch canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Form Card (Left) */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest block">
              EXPEDITION LOG
            </span>
            <h1 className="text-3xl font-heritage font-extrabold text-stone-900 leading-tight">
              Chart Your Course
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              Document your upcoming travels. Specify your parameters below to generate a field guide for your journey.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Destination */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                Destination
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kolkata, Paris, Tokyo, Bali"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
                />
              </div>

              {/* City Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CITY_PRESETS.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setDestination(city)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                      destination.toLowerCase() === city.toLowerCase()
                        ? 'bg-[#c85a44] text-white border-[#c85a44]'
                        : 'bg-[#f2eee5] text-stone-700 border-[#e2dad0] hover:bg-[#e6e0d4]'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Days & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                  Duration: {days} Days
                </label>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full accent-[#c85a44] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                  Travelers
                </label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none"
                >
                  <option value="Solo Traveler">Solo</option>
                  <option value="2 Travelers">Couple</option>
                  <option value="Family Group">Family</option>
                  <option value="Group of Friends">Friends</option>
                </select>
              </div>
            </div>

            {/* Resource Allocation */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                Resource Allocation
              </label>
              <div className="flex gap-2">
                {['Shoestring', 'Standard', 'Opulent'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBudgetCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      budgetCategory === cat
                        ? 'bg-[#c85a44] text-white border-[#c85a44] shadow-sm'
                        : 'bg-[#f2eee5] text-stone-700 border-[#e2dad0] hover:bg-[#e6e0d4]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Draft Itinerary Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#19232d] text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#d96b52]" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#d96b52]" />
              )}
              <span>{loading ? 'Compiling Field Guide...' : 'Draft Itinerary'}</span>
            </button>
          </form>
        </div>

        {/* Vintage Expedition Journal Artwork (Right) */}
        <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-[#e2dad0] shadow-sm relative min-h-[360px]">
          <img
            src="/expedition_journal.png"
            alt="Vintage Expedition Journal Artwork"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#19232d]/75 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#c85a44] px-2.5 py-0.5 rounded-full">
              Archival Field Log
            </span>
            <h3 className="text-xl font-heritage font-extrabold text-white">The Journal of Expeditions</h3>
            <p className="text-xs text-stone-200">Cataloging discoveries across ancient roads and coastal horizons.</p>
          </div>
        </div>

      </div>

      {/* Generated Itinerary Manifest Section */}
      <div className="space-y-8 pt-4">
        
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="w-8 h-8 rounded-full bg-[#c3dec9] border border-[#a8caa7] flex items-center justify-center mx-auto text-[#2b4c30]">
            ✦
          </div>
          <h2 className="text-2xl sm:text-3xl font-heritage font-extrabold text-stone-900">
            The Generated Manifest
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            A curated sequence of events based on your parameters.
          </p>

          {/* Save Trip Button */}
          {itinerary && (
            <div className="pt-2">
              <button
                onClick={handleSaveTrip}
                disabled={saved || saving}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 mx-auto shadow-sm ${
                  saved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#c85a44] text-white hover:bg-[#a54431]'
                }`}
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? '✓ Expedition Saved to Ledger' : saving ? 'Saving...' : 'Save Expedition to Account'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Interactive Leaflet Journey Map */}
        {itinerary && (
          <JourneyMap
            fromAddress={`Start ${destination}`}
            toAddress={`${destination} Center`}
            destinationName={destination}
            waypoints={itinerary.days?.flatMap(d => d.activities || [])}
            title={`Expedition Route: ${destination}`}
            height="380px"
          />
        )}

        {/* Days Timeline Grid matching Google Stitch */}
        {itinerary ? (
          <div className="space-y-8 relative before:absolute before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#e2dad0] hidden sm:block">
            {itinerary.days?.map((day, idx) => (
              <div key={idx} className="relative grid grid-cols-12 gap-6 items-start">
                
                {/* Timeline Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 w-3.5 h-3.5 rounded-full bg-[#c85a44] border-2 border-white shadow-sm z-10" />

                {/* Day Header */}
                <div className={`col-span-5 ${idx % 2 === 0 ? 'text-right pr-6' : 'col-start-7 pl-6'}`}>
                  <span className="text-xl font-heritage font-extrabold text-stone-900 block">
                    Day 0{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest block">
                    {day.theme || 'EXPLORATIONS'}
                  </span>
                </div>

                {/* Day Card */}
                <div className={`col-span-6 ${idx % 2 === 0 ? 'col-start-7' : 'col-start-1 text-right'}`}>
                  <div className="p-6 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] space-y-4 shadow-sm text-left">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                        <Train className="w-3.5 h-3.5 text-[#c85a44]" />
                        <span>Transit: Local Route</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {day.activities?.map((act, aIdx) => {
                        const spotName = getPlaceName(act);
                        return (
                          <div key={aIdx} className="space-y-1 border-t border-[#e2dad0] pt-3 first:border-none first:pt-0">
                            <h4 className="text-base font-heritage font-extrabold text-stone-900">
                              {spotName}
                            </h4>
                            <p className="text-xs text-stone-600 leading-relaxed font-medium">
                              {act.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Archival Lore Box matching Google Stitch */}
                    <div className="p-4 rounded-xl bg-[#c3dec9] border border-[#a8caa7] text-xs text-[#1e3b23] space-y-1">
                      <strong className="block font-bold flex items-center gap-1.5 text-[#142918]">
                        <BookOpen className="w-3.5 h-3.5 text-[#2b5934]" /> Archival Lore
                      </strong>
                      <p className="italic text-[11px] leading-relaxed">
                        "Originally constructed as a heritage landmark, this location preserved timeless architecture near the entrance."
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Initial Demo Manifest */
          <div className="space-y-8 relative max-w-3xl mx-auto">
            
            {/* Day 01 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 text-right pr-4">
                <h3 className="text-xl font-heritage font-extrabold text-stone-900">Day 01</h3>
                <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest block">
                  ARRIVAL & ORIENTATION
                </span>
              </div>

              <div className="md:col-span-8 p-6 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                  <Train className="w-3.5 h-3.5 text-[#c85a44]" />
                  <span>Transit: Historic Line 28</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-heritage font-extrabold text-stone-900">Victoria Memorial Hall</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Settle into your lodgings and explore the white marble landmark surrounded by sprawling gardens and art galleries.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#c3dec9] border border-[#a8caa7] text-xs text-[#1e3b23] space-y-1">
                  <strong className="block font-bold flex items-center gap-1 text-[#142918]">
                    <BookOpen className="w-3.5 h-3.5 text-[#2b5934]" /> Archival Lore
                  </strong>
                  <p className="italic text-[11px] leading-relaxed">
                    "Originally constructed in 1906, this iconic structure preserves grand colonial heritage."
                  </p>
                </div>
              </div>
            </div>

            {/* Day 02 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 text-right pr-4">
                <h3 className="text-xl font-heritage font-extrabold text-stone-900">Day 02</h3>
                <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest block">
                  HIMALAYAN FRONTIER
                </span>
              </div>

              <div className="md:col-span-8 p-6 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                  <Bus className="w-3.5 h-3.5 text-[#c85a44]" />
                  <span>Transit: Shared Mountain SUV</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-heritage font-extrabold text-stone-900">Nathula Pass & Baba Mandir</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Journey through high-altitude Himalayan mountain passes along the historic Indo-China Silk Route.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
