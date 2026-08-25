import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Comprehensive Global & Indian City Geographic Centroids
const CITY_DEFAULT_COORDS = {
  kolkata:    { lat: 22.5726, lng: 88.3639 },
  jaipur:     { lat: 26.9124, lng: 75.7873 },
  nathula:    { lat: 27.3866, lng: 88.8309 },
  gangtok:    { lat: 27.3389, lng: 88.6065 },
  darjeeling: { lat: 27.0410, lng: 88.2663 },
  delhi:      { lat: 28.6139, lng: 77.2090 },
  mumbai:     { lat: 19.0760, lng: 72.8777 },
  goa:        { lat: 15.2993, lng: 74.1240 },
  varanasi:   { lat: 25.3176, lng: 82.9739 },
  agra:       { lat: 27.1767, lng: 78.0081 },
  amritsar:   { lat: 31.6340, lng: 74.8723 },
  bengaluru:  { lat: 12.9716, lng: 77.5946 },
  hyderabad:  { lat: 17.3850, lng: 78.4867 },
  paris:      { lat: 48.8566, lng: 2.3522 },
  rome:       { lat: 41.9028, lng: 12.4964 },
  tokyo:      { lat: 35.6762, lng: 139.6503 },
  london:     { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  dubai:      { lat: 25.2048, lng: 55.2708 },
  bali:       { lat: -8.4095, lng: 115.1889 },
  singapore:  { lat: 1.3521,  lng: 103.8198 },
  bangkok:    { lat: 13.7563, lng: 100.5018 },
};

// Comprehensive Landmark & Heritage POI Database
const PRESET_LANDMARK_COORDS = {
  // Kolkata
  'howrah station':       { lat: 22.5851, lng: 88.3468 },
  'howrah bridge':        { lat: 22.5851, lng: 88.3468 },
  'park street':          { lat: 22.5534, lng: 88.3524 },
  'victoria memorial':    { lat: 22.5448, lng: 88.3426 },
  'kumartuli':            { lat: 22.5976, lng: 88.3619 },
  'college street':       { lat: 22.5744, lng: 88.3629 },
  'princep ghat':         { lat: 22.5562, lng: 88.3361 },
  'newtown':              { lat: 22.5726, lng: 88.4639 },
  'new town':             { lat: 22.5726, lng: 88.4639 },
  'salt lake':            { lat: 22.5867, lng: 88.4171 },
  'sealdah station':      { lat: 22.5675, lng: 88.3712 },
  'dakshineswar':         { lat: 22.6548, lng: 88.3576 },
  'belur math':           { lat: 22.6321, lng: 88.3556 },

  // Jaipur & Rajasthan
  'hawa mahal':           { lat: 26.9239, lng: 75.8267 },
  'city palace':          { lat: 26.9258, lng: 75.8237 },
  'amber fort':           { lat: 26.9855, lng: 75.8513 },
  'amer fort':            { lat: 26.9855, lng: 75.8513 },
  'jantar mantar':        { lat: 26.9248, lng: 75.8246 },
  'nahargarh':            { lat: 26.9373, lng: 75.8156 },
  'jal mahal':            { lat: 26.9535, lng: 75.8462 },
  'bapu bazaar':          { lat: 26.9189, lng: 75.8211 },
  'johari bazaar':        { lat: 26.9213, lng: 75.8272 },
  'chokhi dhani':         { lat: 26.7663, lng: 75.8362 },

  // Sikkim & Nathula
  'tsomgo':               { lat: 27.3742, lng: 88.7619 },
  'changu':               { lat: 27.3742, lng: 88.7619 },
  'baba mandir':          { lat: 27.3911, lng: 88.8215 },
  'baba harbhajan':       { lat: 27.3911, lng: 88.8215 },
  'nathula pass':         { lat: 27.3866, lng: 88.8309 },
  'kupup':                { lat: 27.3601, lng: 88.8315 },
  'elephant lake':        { lat: 27.3601, lng: 88.8315 },
  'mg marg':              { lat: 27.3298, lng: 88.6133 },
  'rumtek':               { lat: 27.3039, lng: 88.5833 },

  // Delhi & Agra
  'india gate':           { lat: 28.6129, lng: 77.2295 },
  'qutub minar':          { lat: 28.5244, lng: 77.1855 },
  'red fort':             { lat: 28.6562, lng: 77.2410 },
  'lotus temple':         { lat: 28.5535, lng: 77.2588 },
  'chandni chowk':        { lat: 28.6506, lng: 77.2303 },
  'taj mahal':            { lat: 27.1751, lng: 78.0421 },
  'agra fort':            { lat: 27.1795, lng: 78.0211 },

  // Goa
  'baga beach':           { lat: 15.5553, lng: 73.7517 },
  'calangute':            { lat: 15.5439, lng: 73.7553 },
  'anjuna':               { lat: 15.5834, lng: 73.7431 },
  'fort aguada':          { lat: 15.4920, lng: 73.7737 },
  'basilica of bom jesus':{ lat: 15.5009, lng: 73.9116 },

  // Global Landmarks
  'eiffel tower':         { lat: 48.8584, lng: 2.2945 },
  'louvre':               { lat: 48.8606, lng: 2.3376 },
  'notre dame':           { lat: 48.8530, lng: 2.3499 },
  'champs elysees':       { lat: 48.8698, lng: 2.3075 },
  'colosseum':            { lat: 41.8902, lng: 12.4922 },
  'vatican':              { lat: 41.9029, lng: 12.4534 },
  'trevi fountain':       { lat: 41.9009, lng: 12.4833 },
  'pantheon':             { lat: 41.8986, lng: 12.4769 },
  'senso-ji':             { lat: 35.7148, lng: 139.7967 },
  'shibuya':              { lat: 35.6580, lng: 139.7016 },
  'tokyo tower':          { lat: 35.6586, lng: 139.7454 },
  'shinjuku':             { lat: 35.6938, lng: 139.7034 },
  'times square':         { lat: 40.7580, lng: -73.9855 },
  'central park':         { lat: 40.7829, lng: -73.9654 },
  'statue of liberty':    { lat: 40.6892, lng: -74.0445 },
  'burj khalifa':         { lat: 25.1972, lng: 55.2744 },
  'dubai mall':           { lat: 25.1985, lng: 55.2796 },
  'marina bay sands':     { lat: 1.2834,  lng: 103.8607 },
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

const createIcon = (color, text) => L.divIcon({
  className: 'custom-waypoint-marker',
  html: `<div style="background-color:${color}; width:26px; height:26px; border-radius:50%; border:2px solid white; box-shadow:0 3px 5px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:11px;">${text}</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const cleanQuery = (str) => {
  if (!str) return '';
  return str.replace(/^(visit|explore|tour|head to|walk around|lunch at|dinner at|breakfast at|travel to|discover)\s+/i, '').trim();
};

export default function JourneyMap({
  fromAddress,
  toAddress,
  fromCoords,
  toCoords,
  waypoints = [],
  destinationName = 'Kolkata',
  showRoute = true,
  height = '400px',
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const [resolvedFrom, setResolvedFrom] = useState(fromCoords || null);
  const [resolvedTo, setResolvedTo] = useState(toCoords || null);
  const [resolvedWaypoints, setResolvedWaypoints] = useState([]);

  const fromCoordsKey = fromCoords ? `${fromCoords.lat},${fromCoords.lng}` : '';
  const toCoordsKey = toCoords ? `${toCoords.lat},${toCoords.lng}` : '';
  const waypointsKey = useMemo(() => JSON.stringify(waypoints.map(w => ({ lat: w.lat, lng: w.lng, p: w.place || w.name || w.activity }))), [waypoints]);

  // Instant In-Memory Geocoder: 0 network calls, 0 rate-limits, 0 CORS errors
  const resolveLocation = (query, cityContext) => {
    if (!query || typeof query !== 'string') return null;
    const cleaned = cleanQuery(query).toLowerCase().trim();

    // 1. Direct Landmark match
    for (const [key, coords] of Object.entries(PRESET_LANDMARK_COORDS)) {
      if (cleaned.includes(key) || key.includes(cleaned)) {
        return { lat: coords.lat, lng: coords.lng, name: query };
      }
    }

    // 2. City centroid match
    const cityKey = (cityContext || destinationName || 'kolkata').toLowerCase().trim();
    for (const [cName, cCoords] of Object.entries(CITY_DEFAULT_COORDS)) {
      if (cleaned.includes(cName) || cityKey.includes(cName)) {
        return { lat: cCoords.lat, lng: cCoords.lng, name: query };
      }
    }

    // 3. Default fallback
    const defaultCity = CITY_DEFAULT_COORDS[cityKey] || CITY_DEFAULT_COORDS.kolkata;
    return { lat: defaultCity.lat, lng: defaultCity.lng, name: query };
  };

  // 1. Instant Synchronous Geocoding
  useEffect(() => {
    const cityKey = destinationName.toLowerCase().trim();
    const cityDefault = CITY_DEFAULT_COORDS[cityKey] || CITY_DEFAULT_COORDS.kolkata;

    // Resolve From Point
    let startPoint = fromCoords;
    if (!startPoint && fromAddress) {
      startPoint = resolveLocation(fromAddress, destinationName);
    }
    if (!startPoint) startPoint = cityDefault;
    setResolvedFrom(startPoint);

    // Resolve To Point
    let endPoint = toCoords;
    if (!endPoint && toAddress) {
      endPoint = resolveLocation(toAddress, destinationName);
    }
    if (!endPoint) endPoint = cityDefault;
    setResolvedTo(endPoint);

    // Resolve Waypoints
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
          const rawLoc = wp.place || wp.name || wp.location || wp.activity || `Stop ${i + 1}`;
          const cleanLoc = cleanQuery(rawLoc);
          const found = resolveLocation(cleanLoc, destinationName);

          // Apply small geographic dispersal jitter around city centroid if matching default
          const isCityCenter = Math.abs(found.lat - cityDefault.lat) < 0.001 && Math.abs(found.lng - cityDefault.lng) < 0.001;
          const angle = (i * 1.3) + 0.5;
          const radius = 0.012 + (i * 0.004);

          const finalLat = isCityCenter ? cityDefault.lat + (Math.sin(angle) * radius) : found.lat;
          const finalLng = isCityCenter ? cityDefault.lng + (Math.cos(angle) * radius) : found.lng;

          resolvedList.push({
            ...wp,
            lat: finalLat,
            lng: finalLng,
            resolvedName: cleanLoc || wp.activity || `Stop ${i + 1}`
          });
        }
      }
      setResolvedWaypoints(resolvedList);
    } else {
      setResolvedWaypoints([]);
    }
  }, [fromAddress, toAddress, fromCoordsKey, toCoordsKey, waypointsKey, destinationName]);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const cityKey = destinationName.toLowerCase().trim();
      const cityDefault = CITY_DEFAULT_COORDS[cityKey] || CITY_DEFAULT_COORDS.kolkata;

      const map = L.map(mapRef.current, {
        center: [cityDefault.lat, cityDefault.lng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Update Map Markers Dynamically
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
                STOP #${idx + 1}
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
            <b style="color:#c85a44; font-size:12px;">🏁 DESTINATION</b>
            <p style="font-size:11px; margin:4px 0 0 0;">${toAddress || destinationName}</p>
          </div>
        `);
      layerGroup.addLayer(marker);
      boundsPoints.push([resolvedTo.lat, resolvedTo.lng]);
    }

    // Polyline
    if (showRoute && boundsPoints.length >= 2) {
      const polyline = L.polyline(boundsPoints, {
        color: '#c85a44',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      });
      layerGroup.addLayer(polyline);
    }

    // Auto Zoom/Fit
    if (boundsPoints.length > 0) {
      try {
        const bounds = L.latLngBounds(boundsPoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (e) {}
    }
  }, [resolvedFrom, resolvedTo, resolvedWaypoints, showRoute]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#e2dad0] shadow-sm relative z-0">
      <div ref={mapRef} style={{ height, width: '100%' }} className="relative z-0" />
    </div>
  );
}
