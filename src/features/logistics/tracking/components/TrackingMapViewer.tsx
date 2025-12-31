// ==============================|| TRACKING MAP VIEWER COMPONENT ||============================== //

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// ==============================|| TYPES ||============================== //

import type { TrackingStatus } from '../types';

interface TrackingMapViewerProps {
  trackingStatus: TrackingStatus;
  height?: number | string;
  showRoute?: boolean; // Hiển thị lộ trình dự kiến
}

// ==============================|| MAP CONTROLS COMPONENT ||============================== //

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [map, center]);
  return null;
}

// ==============================|| MAIN COMPONENT ||============================== //

const TrackingMapViewer = ({ trackingStatus, height = 500, showRoute = true }: TrackingMapViewerProps) => {
  // Current position
  const currentPos: [number, number] = [trackingStatus.currentPosition.latitude, trackingStatus.currentPosition.longitude];

  // Route waypoints for polyline
  const routePositions: [number, number][] = trackingStatus.route?.waypoints.map((wp) => [wp.latitude, wp.longitude]) || [];

  // Get status color
  const getStatusColor = () => {
    switch (trackingStatus.status) {
      case 'moving':
        return '#0288d1'; // Blue
      case 'stopped':
        return '#f57c00'; // Orange
      case 'arrived':
        return '#2e7d32'; // Green
      default:
        return '#757575'; // Grey
    }
  };

  // Custom marker icon based on status
  const createStatusIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <MapContainer center={currentPos} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route polyline (lộ trình dự kiến) */}
        {showRoute && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#757575',
              weight: 3,
              opacity: 0.6,
              dashArray: '10, 10'
            }}
          />
        )}

        {/* Current position marker */}
        <Marker position={currentPos} icon={createStatusIcon(getStatusColor())}>
          <Popup>
            <div>
              <strong>Vị trí hiện tại</strong>
              <br />
              Mã lệnh: {trackingStatus.orderCode}
              <br />
              Trạng thái:{' '}
              {trackingStatus.status === 'moving'
                ? 'Đang di chuyển'
                : trackingStatus.status === 'stopped'
                  ? 'Dừng lại'
                  : trackingStatus.status === 'arrived'
                    ? 'Đã đến'
                    : 'Chờ'}
              <br />
              Tốc độ: {trackingStatus.currentSpeed} km/h
              <br />
              Tọa độ: {trackingStatus.currentPosition.latitude.toFixed(6)}, {trackingStatus.currentPosition.longitude.toFixed(6)}
            </div>
          </Popup>
        </Marker>

        {/* Route waypoints markers */}
        {showRoute &&
          trackingStatus.route?.waypoints.map((waypoint, index) => (
            <Marker
              key={`waypoint-${index}`}
              position={[waypoint.latitude, waypoint.longitude]}
              icon={L.divIcon({
                className: 'route-waypoint',
                html: `
                  <div style="
                    width: 12px;
                    height: 12px;
                    background-color: #757575;
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
                  "></div>
                `,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
              })}
            >
              <Popup>
                <div>
                  <strong>Điểm {index + 1}</strong>
                  <br />
                  {waypoint.latitude.toFixed(6)}, {waypoint.longitude.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          ))}

        <MapController center={currentPos} />
      </MapContainer>
    </div>
  );
};

export default TrackingMapViewer;
