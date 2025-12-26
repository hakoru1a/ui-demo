// ==============================|| FOREST AREAS MAP TYPES ||============================== //

import type { Coordinates, ForestAreaBoundary, ForestArea } from './entity';

// ==============================|| BASE MAP TYPES ||============================== //

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

// ==============================|| MAP VIEW STATE ||============================== //

/**
 * State for managing map view
 */
export interface MapViewState {
  mode: MapEditMode; // Current map mode: view, edit, draw
  selectedAreaId: string | null; // Currently selected forest area ID
  showAreaLayer: boolean; // Lớp hiển thị - Toggle layer visibility
  isDrawing: boolean; // Is currently drawing polygon
  hasUnsavedChanges: boolean; // Has unsaved boundary changes
}

/**
 * Data for a forest area displayed on map
 */
export interface ForestAreaMapData {
  id: string; // Forest area ID
  name: string; // Forest area name
  code: string; // Forest area code
  boundary: ForestAreaBoundary | null; // Polygon boundary data
  calculatedArea: number; // Diện tích tính toán (ha) - Auto calculated from boundary
  centerCoordinates: Coordinates | null; // Tọa độ trung tâm - Auto calculated
  province: string; // Province for display
  status: ForestArea['status']; // Status for styling
}

/**
 * Map form data for editing boundary
 */
export interface ForestAreaMapFormData {
  areaId: string; // Forest area being edited
  boundary: ForestAreaBoundary | null; // Bản đồ vùng trồng - Polygon boundary
  calculatedArea: number; // Diện tích tính toán (Auto) - Calculated from map
  centerCoordinates: Coordinates | null; // Tọa độ trung tâm (Auto, Read-only)
  showLayers: boolean; // Lớp hiển thị - Toggle layer visibility
}

// ==============================|| MAP HOOK RETURN TYPES ||============================== //

/**
 * Return type for useForestAreaMap hook
 */
export interface UseForestAreaMapReturn {
  // Data
  forestAreas: ForestAreaMapData[]; // All forest areas with map data (filtered by search)
  allForestAreas: ForestAreaMapData[]; // All forest areas (unfiltered)
  selectedArea: ForestAreaMapData | null; // Currently selected area
  mapConfig: MapViewConfig; // Map configuration

  // State
  viewState: MapViewState; // Current view state
  isLoading: boolean; // Loading state
  isSaving: boolean; // Saving state
  error: string | null; // Error message

  // Search
  searchValue: string; // Current search value
  setSearchValue: (value: string) => void; // Set search value

  // Actions
  selectArea: (areaId: string | null) => void; // Select a forest area
  setMode: (mode: MapEditMode) => void; // Change map mode
  toggleAreaLayer: () => void; // Toggle area layer visibility

  // Boundary editing
  updateBoundary: (coordinates: Coordinates[]) => void; // Update polygon coordinates
  saveBoundary: () => Promise<boolean>; // Save boundary changes
  cancelEdit: () => void; // Cancel editing and revert changes

  // Point editing (for coordinate input)
  editingBoundary: Coordinates[] | null; // Current editing boundary coordinates
  updatePointCoordinate: (index: number, coord: Coordinates) => void; // Update single point
  addPoint: (coord: Coordinates) => void; // Add new point to polygon
  removePoint: (index: number) => void; // Remove point from polygon

  // Navigation
  navigateToDetail: (areaId: string) => void; // Navigate to detail page
  navigateToList: () => void; // Navigate back to list
}

/**
 * Polygon calculation utilities return type
 */
export interface PolygonCalculation {
  area: number; // Area in hectares
  center: Coordinates; // Center point
  isValid: boolean; // Is polygon valid (closed, min 3 points)
}

// ==============================|| MAP DEFAULT VALUES ||============================== //

export const DEFAULT_MAP_CENTER: Coordinates = {
  latitude: 14.0583, // Vietnam center latitude
  longitude: 108.2772 // Vietnam center longitude
};

export const DEFAULT_MAP_ZOOM = 6;

export const DEFAULT_MAP_VIEW_STATE: MapViewState = {
  mode: 'view',
  selectedAreaId: null,
  showAreaLayer: true,
  isDrawing: false,
  hasUnsavedChanges: false
};

export const DEFAULT_MAP_LAYERS: MapLayer[] = [
  { id: 'forest-areas', name: 'Vùng rừng', visible: true, type: 'polygon' },
  { id: 'boundaries', name: 'Ranh giới', visible: true, type: 'line' }
];
