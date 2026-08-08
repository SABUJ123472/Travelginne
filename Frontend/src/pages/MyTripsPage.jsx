import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Trash2, Copy, ArrowRight, Sparkles, X, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const fetchTrips = () => {
    setLoading(true);
    tripService.getMyTrips().then(res => {
      if (res.data.success) {
        setTrips(res.data.trips || []);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    try {
      await tripService.deleteTrip(id);
      setTrips(prev => prev.filter(t => t._id !== id && t.id !== id));
      if (selectedTrip?._id === id || selectedTrip?.id === id) setSelectedTrip(null);
    } catch (err) {}
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await tripService.duplicateTrip(id);
      if (res.data.success) {
        setTrips(prev => [res.data.trip, ...prev]);
      }
    } catch (err) {}
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2eee5] border border-[#e2dad0] text-[11px] font-bold text-[#c85a44] uppercase tracking-widest">
          <Briefcase className="w-3.5 h-3.5" />
          <span>ARCHIVAL REPOSITORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900">My Saved Expeditions</h1>
        <p className="text-xs text-stone-600">
          Manage, inspect, and duplicate all field guides and AI itineraries cataloged in your account.
        </p>
      </div>

      {loading ? (
        <div className="text-xs text-[#c85a44] py-12 text-center font-bold">Accessing expedition ledger...</div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trips.map((trip, idx) => {
            const tripId = trip._id || trip.id;
            return (
              <div key={idx} className="rounded-3xl bg-white border border-[#e2dad0] p-6 space-y-4 shadow-sm flex flex-col justify-between hover:border-[#c85a44] transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#c85a44]" />
                      <h3 className="text-lg font-heritage font-extrabold text-stone-900">{trip.destination}</h3>
                    </div>
                    <span className="text-xs font-bold text-[#c85a44] bg-[#fff0ed] px-3 py-1 rounded-full border border-[#f5c6bc]">
                      ₹{trip.customBudget || trip.budget || 20000}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-medium">
                    {trip.explanation || `Custom itinerary planned for ${trip.destination}.`}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-500 pt-1">
                    <div>Travelers: <strong className="text-stone-900">{trip.travelers || 2}</strong></div>
                    <div>Days Planned: <strong className="text-stone-900">{trip.days?.length || trip.days || 3}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e2dad0] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicate(tripId)}
                      className="p-2 rounded-xl bg-[#f5efe6] text-stone-600 hover:text-stone-900 text-xs flex items-center gap-1"
                      title="Duplicate Trip"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(tripId)}
                      className="p-2 rounded-xl bg-[#fff0ed] text-[#c85a44] hover:bg-[#c85a44] hover:text-white text-xs flex items-center gap-1 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="px-4 py-2 rounded-xl bg-[#19232d] text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm"
                  >
                    Inspect Field Guide
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-[#e2dad0] text-center space-y-4 max-w-md mx-auto shadow-sm">
          <Briefcase className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-lg font-heritage font-bold text-stone-900">No Expeditions Saved Yet</h3>
          <p className="text-xs text-stone-600">
            Create customized day-by-day field guides using the AI Trip Planner.
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="px-5 py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431]"
          >
            Chart New Expedition
          </button>
        </div>
      )}

      {/* Inspect Itinerary Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white border border-[#e2dad0] p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3">
              <div>
                <h3 className="text-lg font-heritage font-extrabold text-stone-900">{selectedTrip.destination} Manifest</h3>
                <p className="text-xs text-stone-500">Budget: ₹{selectedTrip.customBudget || selectedTrip.budget || 20000}</p>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-1 rounded-full text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedTrip.days?.map((day, dIdx) => (
                <div key={dIdx} className="p-4 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] space-y-3">
                  <h4 className="text-xs font-bold text-[#c85a44] uppercase tracking-wider">{day.title || `Day 0${day.day || dIdx + 1}`}</h4>
                  <div className="space-y-2">
                    {day.activities?.map((act, aIdx) => (
                      <div key={aIdx} className="p-3 rounded-xl bg-white border border-[#e2dad0] text-xs space-y-1">
                        <div className="flex justify-between font-bold text-stone-900">
                          <span>{act.time || 'Morning'} — {act.place || act.name}</span>
                          <span className="text-[#c85a44]">₹{act.estimatedCost || 0}</span>
                        </div>
                        <p className="text-stone-600 text-[11px]">{act.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
