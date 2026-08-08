import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Locate, RefreshCw } from 'lucide-react';

const LOCATIONIQ_KEY = 'pk.4a5adeda02b90e1f15befb4f35e86d9d';

const CITY_DEFAULT_COORDS = {
  paris:      { lat: 48.8566, lng: 2.3522 },
  tokyo:      { lat: 35.6762, lng: 139.6503 },
  london:     { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  dubai:      { lat: 25.2048, lng: 55.2708 },
  rome:       { lat: 41.9028, lng: 12.4964 },
  kolkata:    { lat: 22.5726, lng: 88.3639 },
  darjeeling: { lat: 27.0410, lng: 88.2663 },
  goa:        { lat: 15.2993, lng: 74.1240 },
  jaipur:     { lat: 26.9124, lng: 75.7873 },
  bangkok:    { lat: 13.7563, lng: 100.5018 },
  singapore:  { lat: 1.3521,  lng: 103.8198 },
  bali:       { lat: -8.4095, lng: 115.1889 },
  amsterdam:  { lat: 52.3676, lng: 4.9041 },
  barcelona:  { lat: 41.3851, lng: 2.1734 },
  istanbul:   { lat: 41.0082, lng: 28.9784 },
  cairo:      { lat: 30.0444, lng: 31.2357 },
  sydney:     { lat: -33.8688, lng: 151.2093 },
  delhi:      { lat: 28.6139, lng: 77.2090 },
  mumbai:     { lat: 19.0760, lng: 72.8777 },
  varanasi:   { lat: 25.3176, lng: 82.9739 },
  kerala:     { lat: 10.8505, lng: 76.2711 },
  nathula:    { lat: 27.3866, lng: 88.8309 },
  gurgaon:    { lat: 28.4595, lng: 77.0266 },
};

const createIcon = (color, text) => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background-color:${color}; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px; box-shadow:0 4px 12px rgba(0,0,0,0.35);">${text}</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const startIcon = createIcon('#10b981', '🟢');
const endIcon   = createIcon('#c85a44', '🏁');

export default function JourneyMap({
  fromAddress = '',
  toAddress = '',
  fromCoords = null,
  toCoords = null,
  waypoints = [],
  destinationName = '',
  height = '420px',
  title = 'Interactive Travel Route Map'
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef  = useRef(null);

  const [mapTileStyle, setMapTileStyle] = useState('streets');
  const [userGps, setUserGps] = useState(null);
  const [locating, setLocating] = useState(false);
  const [resolvedFrom, setResolvedFrom] = useState(fromCoords);
  const [resolvedTo, setResolvedTo] = useState(toCoords);
  const [resolvedWaypoints, setResolvedWaypoints] = useState([]);
  const [geocoding, setGeocoding] = useState(false);

  // Clean query string for LocationIQ
  const cleanQuery = (raw) => {
    if (!raw) return '';
    return raw
      .replace(/Visit\s+/gi, '')
      .replace(/Sightseeing at\s+/gi, '')
      .replace(/Morning Visit to\s+/gi, '')
      .replace(/Afternoon Sightseeing at\s+/gi, '')
      .replace(/Local Culinary Lunch\s*—?/gi, '')
      .trim();
  };

  const geocode = async (query) => {
    const cleaned = cleanQuery(query);
    if (!cleaned) return null;

    try {
      const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(cleaned)}&format=json&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
      }
    } catch (e) {}

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned)}&limit=1`, {
        headers: { 'User-Agent': 'TravelGenieApp/1.0' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
      }
    } catch (e) {}

    return null;
  };

  // 1. Geocoding Effect (debounced resolve)
  useEffect(() => {
    let isMounted = true;

    const resolveAll = async () => {
      setGeocoding(true);

      const cityKey = destinationName.toLowerCase().trim();
      const cityDefault = CITY_DEFAULT_COORDS[cityKey] || CITY_DEFAULT_COORDS.kolkata;

      let startPoint = fromCoords;
      if (!startPoint && fromAddress) {
        startPoint = await geocode(fromAddress);
      }
      if (!startPoint) startPoint = cityDefault;
      if (isMounted) setResolvedFrom(startPoint);

      let endPoint = toCoords;
      if (!endPoint && toAddress) {
        endPoint = await geocode(toAddress);
      }
      if (isMounted && endPoint) setResolvedTo(endPoint);

      if (waypoints && waypoints.length > 0) {
        const resolvedList = [];
        for (let i = 0; i < Math.min(waypoints.length, 12); i++) {
          const wp = waypoints[i];
          if (wp.lat && wp.lng) {
            resolvedList.push({
              ...wp,
              resolvedName: wp.place || wp.name || wp.activity || `Stop ${i + 1}`
            });
          } else {
            const rawLoc = wp.place || wp.name || wp.location || wp.activity;
            const cleanLoc = cleanQuery(rawLoc);
            const fullQuery = cleanLoc ? (cleanLoc.toLowerCase().includes(destinationName.toLowerCase()) ? cleanLoc : `${cleanLoc}, ${destinationName}`) : destinationName;
            
            const res = await geocode(fullQuery);
            if (res) {
              resolvedList.push({
                ...wp,
                lat: res.lat,
                lng: res.lng,
                resolvedName: cleanLoc || res.name
              });
            } else {
              const jitterLat = cityDefault.lat + (Math.sin(i * 1.5) * 0.025);
              const jitterLng = cityDefault.lng + (Math.cos(i * 1.5) * 0.025);
              resolvedList.push({
                ...wp,
                lat: jitterLat,
                lng: jitterLng,
                resolvedName: cleanLoc || wp.activity || `Planned Stop ${i + 1}`
              });
            }
          }
        }
        if (isMounted) setResolvedWaypoints(resolvedList);
      } else {
        if (isMounted) setResolvedWaypoints([]);
      }

      if (isMounted) setGeocoding(false);
    };

    resolveAll();
    return () => { isMounted = false; };
  }, [fromAddress, toAddress, fromCoords, toCoords, waypoints, destinationName]);

  // 2. Initialize Leaflet Map Instance ONCE
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const cityKey = destinationName.toLowerCase().trim();
      const cityDefault = CITY_DEFAULT_COORDS[cityKey] || CITY_DEFAULT_COORDS.kolkata;

      const map = L.map(mapRef.current, {
        center: [cityDefault.lat, cityDefault.lng],
        zoom: 12,
        zoomControl: true,
      });

      const TILE_URLS = {
        streets: `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_KEY}`,
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      };

      L.tileLayer(TILE_URLS[mapTileStyle] || TILE_URLS.streets, {
        maxZoom: 19,
        attribution: '© LocationIQ | OpenStreetMap contributors'
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Invalidate size after render to eliminate glitches
      setTimeout(() => map.invalidateSize(), 200);
    }
  }, []);

  // 3. Update Tile Layer on Style Change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const TILE_URLS = {
      streets: `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_KEY}`,
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    };

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    L.tileLayer(TILE_URLS[mapTileStyle] || TILE_URLS.streets, {
      maxZoom: 19,
      attribution: '© LocationIQ | OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);
  }, [mapTileStyle]);

  // 4. Update Map Layers Dynamically without destroying Map Instance
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    layerGroup.clearLayers();
    const boundsPoints = [];

    // Start Marker
    if (resolvedFrom?.lat && resolvedFrom?.lng) {
      const marker = L.marker([resolvedFrom.lat, resolvedFrom.lng], { icon: startIcon })
        .bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <b style="color:#10b981; font-size:12px;">🟢 START LOCATION</b>
            <p style="font-size:11px; margin:4px 0 0 0;">${fromAddress || destinationName}</p>
          </div>
        `);
      layerGroup.addLayer(marker);
      boundsPoints.push([resolvedFrom.lat, resolvedFrom.lng]);
    }

    // Waypoint Markers
    resolvedWaypoints.forEach((wp, idx) => {
      if (wp.lat && wp.lng) {
        const spotTitle = wp.resolvedName || wp.place || wp.name || `Stop ${idx + 1}`;
        const wpIcon = createIcon('#c85a44', `${idx + 1}`);

        const marker = L.marker([wp.lat, wp.lng], { icon: wpIcon })
          .bindPopup(`
            <div style="font-family:sans-serif; padding:6px; max-width:200px;">
              <span style="background-color:#fff0ed; color:#c85a44; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:10px; border:1px solid #f5c6bc; display:inline-block; margin-bottom:4px;">
                PLANNED STOP #${idx + 1}
              </span>
              <h4 style="font-size:13px; font-weight:bold; color:#1c1917; margin:2px 0;">${spotTitle}</h4>
              ${wp.time ? `<p style="font-size:10px; color:#c85a44; font-weight:bold; margin:2px 0;">⏰ ${wp.time}</p>` : ''}
              ${wp.description ? `<p style="font-size:11px; color:#444; margin:4px 0 0 0; line-height:1.3;">${wp.description}</p>` : ''}
            </div>
          `);
        layerGroup.addLayer(marker);
        boundsPoints.push([wp.lat, wp.lng]);
      }
    });

    // Destination Marker
    if (resolvedTo?.lat && resolvedTo?.lng) {
      const marker = L.marker([resolvedTo.lat, resolvedTo.lng], { icon: endIcon })
        .bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <b style="color:#c85a44; font-size:12px;">🏁 DESTINATION CENTER</b>
            <p style="font-size:11px; margin:4px 0 0 0;">${toAddress || destinationName}</p>
          </div>
        `);
      layerGroup.addLayer(marker);
      boundsPoints.push([resolvedTo.lat, resolvedTo.lng]);
    }

    // Polyline Connection Line
    if (boundsPoints.length >= 2) {
      const polyline = L.polyline(boundsPoints, {
        color: '#c85a44',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      });
      layerGroup.addLayer(polyline);

      map.fitBounds(boundsPoints, { padding: [45, 45] });
    } else if (boundsPoints.length === 1) {
      map.setView(boundsPoints[0], 13);
    }

    // User GPS Marker
    if (userGps) {
      const gpsMarker = L.circleMarker([userGps.lat, userGps.lng], {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.9
      }).bindPopup('<b>📍 Your Live GPS Location</b>');
      layerGroup.addLayer(gpsMarker);
    }

    map.invalidateSize();
  }, [resolvedFrom, resolvedTo, resolvedWaypoints, userGps, destinationName, fromAddress, toAddress]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserGps({ lat: latitude, lng: longitude });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
        }
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-[#e2dad0] overflow-hidden relative shadow-sm space-y-0">
      
      {/* Header Bar */}
      <div className="p-3.5 px-5 bg-[#faf8f5] border-b border-[#e2dad0] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-stone-900">
          <Navigation className="w-4 h-4 text-[#c85a44]" />
          <span className="font-heritage">{title}</span>
          {geocoding && (
            <span className="text-[10px] text-[#c85a44] font-semibold animate-pulse flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Mapping route...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Map Layer Switcher */}
          <div className="flex items-center bg-[#f2eee5] border border-[#e2dad0] rounded-xl p-0.5">
            {['streets', 'dark', 'satellite'].map((style) => (
              <button
                key={style}
                onClick={() => setMapTileStyle(style)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                  mapTileStyle === style
                    ? 'bg-[#c85a44] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* GPS Button */}
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="px-3 py-1.5 rounded-xl bg-[#fff0ed] border border-[#f5c6bc] text-[#c85a44] hover:bg-[#c85a44] hover:text-white font-bold text-[11px] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {locating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Locate className="w-3.5 h-3.5" />}
            <span>{locating ? 'Locating...' : 'GPS Location'}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Canvas */}
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full bg-[#faf8f5] z-10"
      />

      {/* Legend Footer Bar */}
      <div className="p-3 px-5 bg-[#faf8f5] border-t border-[#e2dad0] flex flex-wrap items-center justify-between text-[11px] text-stone-600 gap-3">
        <div className="flex items-center gap-4 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Start
          </span>
          {resolvedWaypoints.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c85a44]" /> {resolvedWaypoints.length} Planned Locations Plotted
            </span>
          )}
          {resolvedTo && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c85a44]" /> Destination Center
            </span>
          )}
        </div>
        <span className="text-[10px] text-stone-400 font-mono">
          LocationIQ Maps API • Stable Telemetry
        </span>
      </div>
    </div>
  );
}
