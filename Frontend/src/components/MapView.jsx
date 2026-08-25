import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Compass, RefreshCw } from 'lucide-react';

// Fix Leaflet default icon paths in bundled Vite environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({ places = [], center = [22.5726, 88.3639], zoom = 13 }) {
  const [userPos, setUserPos] = useState(null);
  const [addressName, setAddressName] = useState('');
  const [loadingGps, setLoadingGps] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Browser Geolocation API + Nominatim Reverse Geocoding
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

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
            headers: { 'User-Agent': 'TravelGenieApp/1.0' }
          });
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
      () => {
        setLoadingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Cleanup previous map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const mapCenter = userPos ? [userPos.lat, userPos.lng] : center;
    const map = L.map(mapContainerRef.current).setView(mapCenter, zoom);
    mapInstanceRef.current = map;

    // OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Place Markers
    if (places && places.length > 0) {
      places.forEach((place) => {
        if (place.lat && place.lng) {
          const customMarker = L.divIcon({
            className: 'custom-map-pin',
            html: `<div style="background-color: #c85a44; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">📍</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
          });

          L.marker([place.lat, place.lng], { icon: customMarker })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px;">
                <strong style="color: #1c1917; font-size: 13px; display: block; margin-bottom: 2px;">${place.name || 'Location'}</strong>
                <p style="color: #78716c; font-size: 11px; margin: 0;">${place.category || place.description || 'Heritage Landmark'}</p>
              </div>
            `);
        }
      });
    }

    // User Location Marker
    if (userPos) {
      const userMarker = L.divIcon({
        className: 'user-map-pin',
        html: `<div style="background-color: #2b5934; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(43,89,52,0.5);">👤</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([userPos.lat, userPos.lng], { icon: userMarker })
        .addTo(map)
        .bindPopup(`<strong>Your Current Position</strong><br/>${addressName || 'GPS Located'}`)
        .openPopup();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [places, userPos, center, zoom]);

  return (
    <div className="space-y-3">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f5efe6] border border-[#e2dad0] text-xs">
        <div className="flex items-center gap-2 text-stone-700 font-semibold">
          <Compass className="w-4 h-4 text-[#c85a44]" />
          <span>{addressName ? `Current: ${addressName}` : 'Interactive Geospatial Map'}</span>
        </div>

        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loadingGps}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#e8a048] to-[#c85a44] text-white font-bold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60"
        >
          {loadingGps ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          <span>{loadingGps ? 'Locating...' : 'Locate Me (GPS)'}</span>
        </button>
      </div>

      {/* Leaflet Map Box */}
      <div
        ref={mapContainerRef}
        className="w-full h-80 rounded-2xl border border-[#e2dad0] shadow-sm z-0 overflow-hidden relative"
      />
    </div>
  );
}
