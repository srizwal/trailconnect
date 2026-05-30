import React, { useEffect, useRef } from 'react';

// Dynamically loads Leaflet to avoid SSR issues
export default function TrekMap({ meetingCoords, routeCoords = [], destination = '' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!meetingCoords || mapInstanceRef.current) return;

    // Dynamically import Leaflet
    import('leaflet').then(L => {
      // Add Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current).setView(
        [meetingCoords.lat || 28.0, meetingCoords.lng || 84.0], 10
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Meeting point marker
      const meetIcon = L.divIcon({
        html: `<div style="background:var(--forest-mid,#1a4a35);color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3)">📍 Meeting Point</div>`,
        className: '',
        iconAnchor: [60, 16],
      });

      L.marker([meetingCoords.lat, meetingCoords.lng], { icon: meetIcon })
        .addTo(map)
        .bindPopup(`<b>Meeting Point</b><br>${destination}`);

      // Route polyline
      if (routeCoords.length > 1) {
        const latlngs = routeCoords.map(c => [c.lat, c.lng]);
        L.polyline(latlngs, { color: '#2d7a57', weight: 4, opacity: 0.8, dashArray: '8,4' }).addTo(map);
        map.fitBounds(latlngs);
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [meetingCoords, routeCoords, destination]);

  if (!meetingCoords) return (
    <div style={{ height: 240, background: 'var(--mist)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
      🗺 No map coordinates provided
    </div>
  );

  return (
    <div ref={mapRef} style={{ height: 280, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', zIndex: 0 }} />
  );
}
