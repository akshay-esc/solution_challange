import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Ship, Navigation } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Custom icons using Lucide React rendered to static markup
const createCustomIcon = (color, status) => {
  const pulseClass = status === 'critical' ? 'pulse-critical-marker' : status === 'warning' ? 'pulse-warning-marker' : '';
  const iconMarkup = renderToStaticMarkup(
    <div className={pulseClass} style={{
      backgroundColor: color,
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid white',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      animation: status === 'critical' ? 'pulse-critical 2s infinite' : status === 'warning' ? 'pulse-warning 2s infinite' : 'none'
    }}>
      <Navigation size={14} color="white" style={{ transform: 'rotate(45deg)' }} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const icons = {
  normal: createCustomIcon('#10b981', 'normal'), // Green
  warning: createCustomIcon('#f97316', 'warning'), // Orange
  critical: createCustomIcon('#ef4444', 'critical') // Red
};

const MapComponent = ({ shipments }) => {
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
      {/* CSS to make Google Maps tiles look like a premium dark mode */}
      <style>{`
        .google-dark-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
          className="google-dark-tiles"
        />
        
        {shipments.map(shipment => {
          // Determine polyline colors and styles based on status
          const pathOptions = shipment.status === 'critical' 
            ? { color: '#ef4444', weight: 2, dashArray: '5, 10' } 
            : shipment.status === 'warning'
              ? { color: '#f97316', weight: 2, dashArray: '5, 10' }
              : { color: '#10b981', weight: 2, opacity: 0.5 };

          return (
            <React.Fragment key={shipment.id}>
              {/* Route Polyline (from current position to destination) */}
              {shipment.destLat && shipment.destLng && (
                <Polyline 
                  positions={[
                    [shipment.lat, shipment.lng],
                    [shipment.destLat, shipment.destLng]
                  ]} 
                  pathOptions={pathOptions}
                />
              )}
              
              <Marker 
                position={[shipment.lat, shipment.lng]}
                icon={icons[shipment.status]}
              >
            <Popup className="custom-popup">
              <div style={{ color: '#0f172a', minWidth: '150px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>{shipment.id}</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}><strong>Route:</strong> {shipment.origin} &rarr; {shipment.dest}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}><strong>Status:</strong> <span style={{ color: shipment.status === 'critical' ? 'red' : shipment.status === 'warning' ? 'orange' : 'green', textTransform: 'capitalize', fontWeight: 'bold' }}>{shipment.status}</span></p>
                <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px', marginTop: '10px' }}>
                  <div style={{ width: `${shipment.progress}%`, backgroundColor: '#3b82f6', height: '100%', borderRadius: '3px' }}></div>
                </div>
              </div>
            </Popup>
          </Marker>
            </React.Fragment>
        )})}

        {/* Example Disruption Zones */}
        <CircleMarker center={[14.5995, 120.9842]} radius={40} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2 }}>
           <Popup>Typhoon Mawar Danger Zone</Popup>
        </CircleMarker>

        <CircleMarker center={[33.7490, -118.2437]} radius={25} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.2 }}>
           <Popup>Long Beach Congestion Zone</Popup>
        </CircleMarker>

      </MapContainer>
    </div>
  );
};

export default MapComponent;
