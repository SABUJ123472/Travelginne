import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Compass, RefreshCw } from 'lucide-react';

export default function MapView({ places = [], center = [22.5726, 88.3639], zoom = 13 }) {
  const [userPos, setUserPos] = useState(null);
  const [addressName, setAddressName] = useState('');
  const [loadingGps, setLoadingGps] = useState(false);

  // Browser Geolocation API + Nominatim Reverse Geocoding API
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });

        // Nominatim OpenStreetMap Reverse Geocoding
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddressName(data.display_name.split(',').slice(0, 3).join(','));
          }
        } catch (e) {
          setAddressName(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        } finally {
          setLoadingGps(false);
        }
      },
      (err) => {
        setLoadingGps(false);
      }
    );
  };

  useEffect(() => {
    // Leaflet + OpenStreetMap Map Rendering
    if (typeof window !== 'undefined' && window.L) {
      const container = document.getElementById('map-leaflet-container');
      if (container) {
        if (container._leaflet_id) {
          container._leaflet_id = null;
        }

        const mapCenter = userPos ? [userPos.lat, userPos.lng] : center;
        const map = window.L.map('map-leaflet-container').setView(mapCenter, zoom);

        // OpenStreetMap Tile Layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // User position marker
        if (userPos) {
          window.L.circleMarker([userPos.lat, userPos.lng], {
            radius: 8,
            fillColor: "#0d9488",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(map).bindPopup("<b>📍 Your Current Location</b>").openPopup();
        }

        // Places markers
        places.forEach(p => {
          if (p.coordinates?.lat && p.coordinates?.lng) {
            window.L.marker([p.coordinates.lat, p.coordinates.lng])
              .addTo(map)
              .bindPopup(`<b>${p.name}</b><br/>${p.category || p.type || ''}`);
          }
        });
      }
    }
  }, [center, zoom, places, userPos]);

  return (
    <div className="w-full h-96 rounded-3xl glass-card border border-slate-800 overflow-hidden relative shadow-2xl">
      
      {/* Leaflet + OpenStreetMap Container */}
      <div id="map-leaflet-container" className="w-full h-full bg-slate-900">
        {/* Graphical fallback if Leaflet script is still loading */}
        <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-teal-950/40 flex flex-col items-center justify-center p-6 text-center">
          <Compass className="w-10 h-10 text-teal-400 mb-2 animate-pulse" />
          <h4 className="text-sm font-bold text-white mb-1">Leaflet + OpenStreetMap Radar</h4>
          <p className="text-xs text-slate-400 max-w-sm mb-3">Rendering OpenStreetMap tiles with GPS location coordinates.</p>
        </div>
      </div>

      {/* Top Left Geolocation Pill */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2">
        <button
          onClick={handleGetLocation}
          disabled={loadingGps}
          className="px-3.5 py-2 rounded-xl bg-slate-950/90 border border-teal-500/40 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 backdrop-blur-md"
        >
          {loadingGps ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5 text-teal-400" />}
          <span>{loadingGps ? 'Locating...' : 'My Live GPS Location'}</span>
        </button>

        {addressName && (
          <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-200 font-medium truncate max-w-xs shadow-md backdrop-blur-md">
            📍 {addressName}
          </span>
        )}
      </div>

      {/* Bottom Right Badge */}
      <div className="absolute bottom-3 right-3 z-[400] px-3 py-1 rounded-full bg-slate-950/90 border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-1 shadow-md backdrop-blur-md">
        <span>Leaflet v1.9 + OpenStreetMap + Nominatim</span>
      </div>
    </div>
  );
}
