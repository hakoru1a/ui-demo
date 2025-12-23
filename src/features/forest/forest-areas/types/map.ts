// ==============================|| FOREST AREAS MAP TYPES ||============================== //

import type { Coordinates } from './entity';

export interface MapLayer {
  id: string; // Layer ID
  name: string; // Layer name
  visible: boolean; // Layer visibility
  type: 'polygon' | 'marker' | 'line' | 'raster'; // Layer type
}

export interface MapViewConfig {
  center: Coordinates; // Center coordinates
  zoom: number; // Zoom level
  layers: MapLayer[]; // Available layers
  allowEdit: boolean; // Show boundary editing tools
}

export type MapEditMode = 'view' | 'edit' | 'draw'; // Map draw/edit mode
export type MapAction = 'save' | 'edit' | 'view-detail' | 'back-to-list'; // Map action types
