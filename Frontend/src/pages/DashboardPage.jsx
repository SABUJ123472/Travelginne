import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass, MapPin, Search, ArrowRight, CloudSun, Wallet,
  ShieldCheck, Sparkles, Gem, Clock, Plus, Trash2, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripService, safetyService, rewardService } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');

  // Live Backend State
  const [savedTrips, setSavedTrips] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loadingTrips, setLoadingTrips] = useState(true);

  const fetchDashboardData = async () => {
    setLoadingTrips(true);
    try {
      const [tripsRes, safetyRes, statsRes] = await Promise.allSettled([
        tripService.getMyTrips(),
        safetyService.getWeatherSafety('Kolkata'),
        rewardService.getUserStats()
      ]);

      if (tripsRes.status === 'fulfilled' && tripsRes.value.data.success) {
        setSavedTrips(tripsRes.value.data.trips || []);
      }
      if (safetyRes.status === 'fulfilled' && safetyRes.value.data.success) {
        setWeatherData(safetyRes.value.data);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setUserStats(statsRes.value.data.stats || statsRes.value.data);
      }
    } catch (e) {
    } finally {
      setLoadingTrips(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/planner?city=${encodeURIComponent(searchCity.trim())}`);
    }
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();
    try {
      await tripService.deleteTrip(id);
      setSavedTrips(prev => prev.filter(t => t._id !== id && t.id !== id));
    } catch (err) {}
  };

  const userName = user?.name || 'Sabuj';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Header matching Google Stitch canvas */}
      <div className="text-center py-6 space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2eee5] border border-[#e2dad0] text-stone-600 text-[11px] font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d96b52]" />
          <span>Journal Entry • {userStats?.rank || 'Level 1 Explorer'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-heritage font-extrabold text-stone-900 leading-tight">
          <span className="font-script text-[#c85a44] italic font-normal block mb-1">
            নমস্কার, {userName}!
          </span>
          Where are you going next?
        </h1>

        {/* Input Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
          <div className="relative flex items-center bg-[#f2eee5] p-1.5 rounded-2xl border border-[#e2dad0] shadow-sm">
            <Compass className="w-4 h-4 text-stone-400 absolute left-4" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search a destination, e.g., Kyoto, Japan..."
              className="w-full pl-10 pr-32 py-2.5 bg-transparent border-none text-xs text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-5 py-2 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Plan Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* 3 Quick Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Weather Card */}
        <div className="p-5 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] space-y-3 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-[#d96b52]" /> Weather
            </span>
            <span className="text-lg opacity-40">☀️</span>
          </div>
          <div>
            <div className="text-3xl font-heritage font-extrabold text-stone-900">
              {weatherData?.weather?.temp ? `${weatherData.weather.temp}°C` : '28°C'}
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {weatherData?.weather?.condition || 'Pleasant Weather'} • {weatherData?.city || 'Kolkata'}
            </p>
          </div>
        </div>

        {/* Explorer Points */}
        <div className="p-5 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] space-y-3 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#d96b52]" /> Explorer Points
            </span>
            <span className="text-base opacity-40 font-mono">🏆</span>
          </div>
          <div>
            <div className="text-3xl font-heritage font-extrabold text-stone-900">
              {userStats?.points || 250} PTS
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {userStats?.streak ? `${userStats.streak} Day Check-in Streak` : 'Active Explorer Member'}
            </p>
          </div>
        </div>

        {/* Advisory Card */}
        <div className="p-5 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] space-y-3 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d96b52]" /> Safety Status
            </span>
            <span className="text-base opacity-40">🛡️</span>
          </div>
          <div>
            <div className="text-3xl font-heritage font-extrabold text-stone-900">
              {weatherData?.safety?.status || 'Standard'}
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {weatherData?.safety?.advisory || 'Exercise Normal Precautions'}
            </p>
          </div>
        </div>
      </div>

      {/* Your Saved Expeditions */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heritage font-extrabold text-stone-900">Your Saved Expeditions</h2>
            <p className="text-xs text-stone-500">Live field guides & itineraries saved to your account.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#f2eee5] border border-[#e2dad0] text-[10px] font-bold text-stone-600 uppercase tracking-widest">
            [ {savedTrips.length} SAVED ]
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Saved Trips List */}
          <div className="lg:col-span-8">
            {savedTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedTrips.map((trip) => {
                  const tripId = trip._id || trip.id;
                  return (
                    <div
                      key={tripId}
                      onClick={() => navigate(`/mytrips`)}
                      className="p-5 rounded-2xl bg-white border border-[#e2dad0] space-y-3 shadow-sm hover:border-[#d96b52] cursor-pointer transition-all relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-wider bg-[#fff0ed] px-2 py-0.5 rounded-full">
                          {trip.days || 3} Days Trip
                        </span>
                        <button
                          onClick={(e) => handleDeleteTrip(tripId, e)}
                          className="p-1 rounded-full text-stone-400 hover:text-[#c85a44] transition-colors"
                          title="Delete Trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h3 className="text-base font-heritage font-extrabold text-stone-900">{trip.destination}</h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-[#d96b52]" />
                          <span>{new Date(trip.createdAt || Date.now()).toLocaleDateString()}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#f0eaee] text-xs font-bold text-[#c85a44]">
                        <span>View Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[260px]">
                <div className="w-16 h-16 rounded-full bg-[#f5efe6] border border-[#e2dad0] flex items-center justify-center">
                  <Compass className="w-8 h-8 text-stone-400" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-lg font-heritage font-extrabold text-stone-900">No Expeditions Planned</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Your ledger is currently blank. Chart a new course to begin cataloging your adventures.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/planner')}
                  className="px-5 py-2.5 rounded-full bg-[#f5efe6] border border-[#e2dad0] text-stone-800 text-xs font-bold hover:bg-[#e2dad0] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#d96b52]" />
                  <span>Start New Entry</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Widget Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Discover Hidden Gems Banner */}
            <div className="p-6 rounded-2xl bg-[#c85a44] text-white space-y-4 shadow-sm relative overflow-hidden">
              <div className="space-y-1">
                <h3 className="text-xl font-heritage font-extrabold">Discover Hidden Gems</h3>
                <p className="text-xs text-stone-100/90 leading-relaxed">
                  Let AI curate a bespoke itinerary off the beaten path.
                </p>
              </div>
              <button
                onClick={() => navigate('/gems')}
                className="w-full py-2.5 rounded-xl bg-white text-[#c85a44] font-bold text-xs hover:bg-stone-50 transition-colors shadow-sm"
              >
                Generate Itinerary
              </button>
            </div>

            {/* Recent Searches */}
            <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] space-y-3 shadow-sm">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" /> Recent Searches
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => navigate('/planner?city=Kyoto')}
                  className="p-2.5 rounded-xl bg-[#f5efe6] hover:bg-[#e2dad0] transition-colors cursor-pointer flex items-center gap-3 text-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-stone-500">
                    ✈️
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-bold">Kyoto, Japan</strong>
                    <span className="text-[10px] text-stone-500">Oct 12 – Oct 18</span>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/planner?city=Paris')}
                  className="p-2.5 rounded-xl bg-[#f5efe6] hover:bg-[#e2dad0] transition-colors cursor-pointer flex items-center gap-3 text-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-stone-500">
                    ✈️
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-bold">Paris, France</strong>
                    <span className="text-[10px] text-stone-500">Nov 05 – Nov 10</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
