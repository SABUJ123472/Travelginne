import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Navigation, Search, RefreshCw, ArrowRight, Train, Clock, DollarSign, Car, Ship, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { transportService } from '../services/api';
import JourneyMap from '../components/JourneyMap';

const MODE_ICONS = {
  Train: Train,
  Bus: Bus,
  Car: Car,
  Ship: Ship,
};

export default function PublicTransportPage() {
  const [fromAddress, setFromAddress] = useState('Howrah Station, Kolkata');
  const [toAddress, setToAddress]   = useState('Park Street, Kolkata');
  const [transitMode, setTransitMode] = useState('Transit');

  // Submitted Address States to prevent map glitching on keystrokes
  const [submittedFrom, setSubmittedFrom] = useState('Howrah Station, Kolkata');
  const [submittedTo, setSubmittedTo]     = useState('Park Street, Kolkata');

  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);

  const fetchRoute = async (from = fromAddress, to = toAddress) => {
    if (!from.trim() || !to.trim()) return;

    setSubmittedFrom(from.trim());
    setSubmittedTo(to.trim());

    setLoading(true);
    try {
      const res = await transportService.getRoute({
        from: from.trim(),
        to: to.trim(),
        mode: transitMode,
      });

      if (res.data.success) {
        setRouteData(res.data.route || res.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute('Howrah Station, Kolkata', 'Park Street, Kolkata');
  }, []);

  const handleRouteSearch = (e) => {
    e && e.preventDefault();
    fetchRoute(fromAddress, toAddress);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
            TRANSIT NAVIGATOR & ROUTING ENGINE
          </span>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-bengali">
            গণপরিবহন পথ নির্দেশক
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">
          Public Transport & Route Navigator
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Calculate multi-modal transit routes including underground metro lines, city buses, trams, ferries, and rideshares with real-time fares and distance telemetry.
        </p>
      </div>

      {/* Transit Route Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-6">
        <form onSubmit={handleRouteSearch} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Origin */}
            <div className="space-y-1">
              <label htmlFor="transport-from" className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Origin Address / Landmark</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="transport-from"
                  name="from"
                  type="text"
                  autoComplete="off"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  placeholder="Starting location (e.g. Howrah Station, Kolkata)..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label htmlFor="transport-to" className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Destination Address / Landmark</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="transport-to"
                  name="to"
                  type="text"
                  autoComplete="off"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="Destination (e.g. Park Street, Kolkata)..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#d96b52]"
                />
              </div>
            </div>

          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider self-center mr-1">Sample Routes:</span>
            {[
              { from: 'Howrah Station, Kolkata', to: 'Park Street, Kolkata' },
              { from: 'Victoria Memorial, Kolkata', to: 'Dakshineswar Kali Temple' },
              { from: 'Eiffel Tower, Paris', to: 'Louvre Museum, Paris' },
              { from: 'Tokyo Station', to: 'Shibuya Crossing, Tokyo' },
            ].map((preset, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => {
                  setFromAddress(preset.from);
                  setToAddress(preset.to);
                  fetchRoute(preset.from, preset.to);
                }}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f2eee5] border border-[#e2dad0] text-stone-700 hover:bg-[#e6e0d4] transition-all"
              >
                {preset.from.split(',')[0]} ➔ {preset.to.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Preferred Transit Mode */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">Filter Preferred Transit Mode</label>
            <div className="flex flex-wrap gap-2">
              {['All Modes', 'Metro', 'Bus', 'Tram', 'Ferry', 'Taxi'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTransitMode(mode)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    transitMode === mode || (transitMode === 'Transit' && mode === 'All Modes')
                      ? 'bg-[#c85a44] text-white border-[#c85a44] shadow-sm'
                      : 'bg-[#f2eee5] border-[#e2dad0] text-stone-700 hover:bg-[#e6e0d4]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#19232d] text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-[#d96b52]" /> : <Navigation className="w-4 h-4 text-[#d96b52]" />}
            <span>{loading ? 'Calculating Route Telemetry...' : 'Calculate Route Directions'}</span>
          </button>

        </form>
      </div>

      {/* Interactive Map Display */}
      <JourneyMap
        fromAddress={submittedFrom}
        toAddress={submittedTo}
        destinationName={submittedFrom}
        fromCoords={routeData?.fromCoords}
        toCoords={routeData?.toCoords}
        title={`Transit Route: ${submittedFrom} ➔ ${submittedTo}`}
        height="400px"
      />

      {/* Route Telemetry & Multi-Modal Options */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-white border border-[#e2dad0] text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#c85a44] animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-900">Calculating optimal transit routes...</p>
        </div>
      ) : routeData ? (
        <div className="space-y-6">
          
          {/* Summary Banner Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest block">ROUTING SUMMARY</span>
                <h3 className="text-xl font-heritage font-extrabold text-stone-900">
                  {routeData.geocodedFrom || submittedFrom} ➔ {routeData.geocodedTo || submittedTo}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-[#c3dec9] px-3 py-1 rounded-full border border-[#a8caa7]">
                {routeData.options?.length || 0} Transit Options
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-stone-700">
              <div className="p-3.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Est. Road Distance</span>
                <strong className="text-stone-900 text-sm font-bold">{routeData.distanceKm || 7.2} km</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Telemetry Provider</span>
                <strong className="text-stone-900 text-xs font-bold">{routeData.provider || 'LocationIQ Routing API'}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Carbon Impact</span>
                <strong className="text-[#2b4c30] text-xs font-bold">🌿 Eco-Friendly Transit (94%)</strong>
              </div>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-heritage font-extrabold text-stone-900">Available Transport Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routeData.options?.map((opt, idx) => {
                const IconComponent = MODE_ICONS[opt.icon] || Bus;
                return (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-[#e2dad0] shadow-sm hover:border-[#c85a44] transition-all space-y-4 flex flex-col justify-between">
                    
                    <div className="space-y-3">
                      {/* Top Header & Badges */}
                      <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-[#fff0ed] text-[#c85a44] border border-[#f5c6bc] flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-[#c85a44]" />
                          </div>
                          <div>
                            <h4 className="text-base font-heritage font-extrabold text-stone-900">{opt.mode}</h4>
                            <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-wider block">
                              {opt.badge}
                            </span>
                          </div>
                        </div>

                        {opt.isFastest && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#c85a44] text-white text-[10px] font-bold uppercase tracking-wider">
                            ⚡ Fastest
                          </span>
                        )}
                        {opt.isBestBudget && !opt.isFastest && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#2b4c30] text-white text-[10px] font-bold uppercase tracking-wider">
                            💰 Best Value
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-stone-600 leading-relaxed">{opt.description}</p>
                    </div>

                    {/* Footer Metrics */}
                    <div className="pt-3 border-t border-[#e2dad0] grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">Est. Time</span>
                        <strong className="text-stone-900 font-bold">{opt.estimatedTime}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">Est. Fare</span>
                        <strong className="text-[#c85a44] font-bold">₹{opt.estimatedCost}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-[#f5efe6] border border-[#e2dad0]">
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">Transfers</span>
                        <strong className="text-stone-900 font-bold">{opt.transfers === 0 ? 'Direct' : `${opt.transfers} Transfer`}</strong>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
