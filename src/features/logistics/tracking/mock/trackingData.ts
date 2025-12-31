// ==============================|| TRACKING MOCK DATA ||============================== //

import type { TrackingStatus, TrackingRoute } from '../types';

// Mock route for order DO-002
export const mockRoute: TrackingRoute = {
  id: 'route-1',
  orderId: '2',
  orderCode: 'DO-002',
  waypoints: [
    { latitude: 16.0544, longitude: 108.2022, timestamp: new Date('2025-12-21T10:00:00') }, // Đà Nẵng
    { latitude: 16.0678, longitude: 108.2208, timestamp: new Date('2025-12-21T10:30:00') },
    { latitude: 16.08, longitude: 108.25, timestamp: new Date('2025-12-21T11:00:00') },
    { latitude: 10.0452, longitude: 105.7469, timestamp: new Date('2025-12-21T20:00:00') } // Cần Thơ
  ],
  estimatedArrival: new Date('2025-12-21T20:00:00')
};

// Mock current tracking status
export const mockTrackingStatus: TrackingStatus = {
  id: 'tracking-1',
  orderId: '2',
  orderCode: 'DO-002',
  currentPosition: {
    latitude: 16.0678,
    longitude: 108.2208,
    timestamp: new Date()
  },
  status: 'moving',
  currentSpeed: 65.5,
  route: mockRoute,
  lastUpdated: new Date()
};

export const getMockTrackingStatus = () => mockTrackingStatus;
export const getMockRoute = () => mockRoute;
