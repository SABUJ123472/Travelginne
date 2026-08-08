import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LOCATIONIQ_KEY = 'pk.4a5adeda02b90e1f15befb4f35e86d9d';

const CITY_DEFAULT_COORDS = {
  kolkata:    { lat: 22.5726, lng: 88.3639 },
  paris:      { lat: 48.8566, lng: 2.3522 },
  tokyo:      { lat: 35.6762, lng: 139.6503 },
  london:     { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  dubai:      { lat: 25.2048, lng: 55.2708 },
  rome:       { lat: 41.9028, lng: 12.4964 },
  darjeeling: { lat: 27.0410, lng: 88.2663 },
  goa:        { lat: 15.2993, lng: 74.1240 },
  jaipur:     { lat: 26.9124, lng: 75.7873 },
  bali:       { lat: -8.4095, lng: 115.1889 },
  delhi:      { lat: 28.6139, lng: 77.2090 },
  mumbai:     { lat: 19.0760, lng: 72.8777 },
  varanasi:   { lat: 25.3176, lng: 82.9739 },
  nathula:    { lat: 27.3866, lng: 88.8309 },
  gurgaon:    { lat: 28.4595, lng: 77.0266 },
};

const startIcon = L.divIcon({
  className: 'custom-start-marker',
  html: `<div style="background-color:#10b981; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px;">S</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const endIcon = L.divIcon({
  className: 'custom-end-marker',
  html: `<div style="background-color:#c85a44; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px;">E</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const createIcon = (color, label) => L.divIcon({
  className: 'custom-wp-marker',
  html: `<div style="background-color:${color}; width:26px; height:26px; border-radius:50%; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:11px;">${label}</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

export default function JourneyMap({
  fromAddress,
  toAddress,
  destinationName = 'Kolkata',
  fromCoords,
  toCoords,
  waypoints = [],
  height = '400px',
  title = 'Route Map'
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const [mapTileStyle, setMapTileStyle] = useState('streets');
  const [resolvedFrom, setResolvedFrom] = useState(fromCoords || null);
  const [resolvedTo, setResolvedTo] = useState(toCoords || null);
  const [resolvedWaypoints, setResolvedWaypoints] = useState([]);
  const [geocoding, setGeocoding] = useState(false);

  const waypointsKey = useMemo(() => JSON.stringify(waypoints || []), [waypoints]);
  const fromCoordsKey = fromCoords ? `${fromCoords.lat},${fromCoords.lng}` : '';
  const toCoordsKey = toCoords ? `${toCoords.lat},${toCoords.lng}` : '';

  const cleanQuery = (str) => {
    if (!str) return '';
    return str
      .replace(/^(Visit|Sightseeing at|Exploration of|Check-in at|Explore|Tour of)\s+/i, '')
      .trim();
  };

  const geocode = async (query) => {
    const cleaned = cleanQuery(query);
    if (!cleaned) return null;

    try {
      const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(cleaned)}&format=json&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
        }
      }
    } catch (e) {}

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleaned)}&limit=1`, {
        headers: { 'User-Agent': 'TravelGenieApp/1.0' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
        }
      }
    } catch (e) {}

    return null;
  };

  // 1. Geocoding Effect (debounced resolve)
  useEffect(() => {
    let isMounted = true;

    const resolveAll = async () => {
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
    };

    resolveAll();
    return () => { isMounted = false; };
  }, [fromAddress, toAddress, fromCoordsKey, toCoordsKey, waypointsKey, destinationName]);

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
  }, [resolvedFrom, resolvedTo, resolvedWaypoints, fromAddress, toAddress, destinationName]);

  return (
    <div className="rounded-3xl bg-white border border-[#e2dad0] shadow-sm overflow-hidden space-y-0">
      
      {/* Map Control Header matching Google Stitch */}
      <div className="p-4 bg-[#f5efe6] border-b border-[#e2dad0] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c85a44] animate-pulse" />
          <h3 className="text-xs font-heritage font-extrabold text-stone-900 uppercase tracking-wider">{title}</h3>
        </div>

        {/* Tile Style Picker */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          {['streets', 'dark', 'satellite'].map((style) => (
            <button
              key={style}
              onClick={() => setMapTileStyle(style)}
              className={`px-2.5 py-1 rounded-full border transition-all uppercase tracking-wider ${
                mapTileStyle === style
                  ? 'bg-[#c85a44] text-white border-[#c85a44] shadow-sm'
                  : 'bg-white text-stone-700 border-[#e2dad0] hover:bg-[#e6e0d4]'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative">
        <div ref={mapRef} style={{ height }} className="w-full z-0" />
      </div>

    </div>
  );
}
