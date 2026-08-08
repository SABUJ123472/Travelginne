import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, CloudSun, Wind, Droplets, Gauge, AlertTriangle,
  Search, RefreshCw, CheckCircle2, Navigation, Phone, MapPin, Thermometer
} from 'lucide-react';
import { safetyService } from '../services/api';

const POPULAR_CITIES = ['Kolkata', 'Delhi', 'Mumbai', 'Jaipur', 'Goa', 'Varanasi', 'Darjeeling', 'Paris', 'Tokyo', 'Rome', 'Bali'];

export default function WeatherSafetyPage() {
  const [city, setCity] = useState('Kolkata');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchSafetyData = async (queryCity = city) => {
    setLoading(true);
    try {
      const res = await safetyService.getWeatherSafety(queryCity);
      if (res.data.success) {
        setData(res.data.weatherSafety || res.data);
        setCity(queryCity);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyData('Kolkata');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchSafetyData(searchCity.trim());
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
            LIVE METEOROLOGICAL & SAFETY ENGINE
          </span>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
            আবহাওয়া ও নিরাপত্তা নির্দেশিকা
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">
          Weather & Travel Safety Engine
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Real-time weather telemetry, temperature, humidity, wind speeds, and travel risk advisories calculated for your destination.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2dad0] shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search weather & safety by city (e.g. Kolkata, Paris, Tokyo, Darjeeling, Delhi)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50 shadow-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Check Advisory</span>
          </button>
        </form>

        {/* Quick Preset Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider self-center mr-1">Popular Cities:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => { setSearchCity(c); fetchSafetyData(c); }}
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

      {/* Main Data Display */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#c85a44] animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-900">Querying live weather telemetry for {city}...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Temperature & Weather */}
            <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
                <span className="text-xs font-bold text-[#c85a44] uppercase tracking-wider">{data.city || city}</span>
                <CloudSun className="w-5 h-5 text-[#c85a44]" />
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-heritage font-extrabold text-stone-900">
                  {data.temperature || '28°C'}
                </div>
                <p className="text-xs font-bold text-stone-700">{data.condition || 'Partly Cloudy'}</p>
                <p className="text-xs text-stone-500">Feels like {data.feelsLike || '29°C'}</p>
              </div>
            </div>

            {/* Weather Metrics */}
            <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-3 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block border-b border-[#e2dad0] pb-3">
                Telemetry Breakdown
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Humidity</span>
                  <strong className="text-stone-900 font-bold">{data.humidity || '65%'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Wind Speed</span>
                  <strong className="text-stone-900 font-bold">{data.windSpeed || '12 km/h'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Rain Risk</span>
                  <strong className="text-stone-900 font-bold">{data.rainProbability || '10%'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Pressure</span>
                  <strong className="text-stone-900 font-bold">{data.pressure || '1012 hPa'}</strong>
                </div>
              </div>
            </div>

            {/* Safety Index Card */}
            <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
                <span className="text-xs font-bold text-[#c85a44] uppercase tracking-wider">Safety Status</span>
                <ShieldCheck className="w-5 h-5 text-[#2b4c30]" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-heritage font-extrabold text-stone-900">
                  {data.safetyStatus || 'Safe'}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1">
                  {data.advisory || 'Exercise normal safety precautions when traveling.'}
                </p>
              </div>
            </div>

          </div>

          {/* Safety Tips List */}
          {data.safetyTips && data.safetyTips.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm">
              <h3 className="text-base font-heritage font-extrabold text-stone-900 border-b border-[#e2dad0] pb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#c85a44]" />
                <span>Traveler Guidelines & Safety Instructions</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {data.safetyTips.map((tip, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0] flex items-start gap-2.5 text-stone-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#2b4c30] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
}
