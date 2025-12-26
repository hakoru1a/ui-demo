// ==============================|| FOREST AREA MAP HOOK ||============================== //

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { mockForestAreas } from '../mock/forestAreas';
import type {
  Coordinates,
  ForestArea,
  MapViewState,
  MapViewConfig,
  MapEditMode,
  ForestAreaMapData,
  UseForestAreaMapReturn,
  PolygonCalculation
} from '../types';
import { FOREST_AREA_URLS } from '../types/constants';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, DEFAULT_MAP_VIEW_STATE, DEFAULT_MAP_LAYERS } from '../types/map';

// ==============================|| POLYGON UTILITIES ||============================== //

/**
 * Calculate area of polygon using Shoelace formula (approximation for small areas)
 * Returns area in hectares
 */
export function calculatePolygonArea(coordinates: Coordinates[]): number {
  if (coordinates.length < 3) return 0;

  // Earth radius in meters
  const R = 6371000;

  // Convert to radians and calculate using spherical excess formula
  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const lat1 = (coordinates[i].latitude * Math.PI) / 180;
    const lat2 = (coordinates[j].latitude * Math.PI) / 180;
    const lng1 = (coordinates[i].longitude * Math.PI) / 180;
    const lng2 = (coordinates[j].longitude * Math.PI) / 180;

    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs((area * R * R) / 2);

  // Convert m² to hectares (1 ha = 10000 m²)
  return Math.round((area / 10000) * 100) / 100;
}

/**
 * Calculate center point of polygon
 */
export function calculatePolygonCenter(coordinates: Coordinates[]): Coordinates {
  if (coordinates.length === 0) {
    return DEFAULT_MAP_CENTER;
  }

  const sumLat = coordinates.reduce((sum, coord) => sum + coord.latitude, 0);
  const sumLng = coordinates.reduce((sum, coord) => sum + coord.longitude, 0);

  return {
    latitude: Math.round((sumLat / coordinates.length) * 1000000) / 1000000,
    longitude: Math.round((sumLng / coordinates.length) * 1000000) / 1000000
  };
}

/**
 * Validate and calculate polygon properties
 */
export function calculatePolygon(coordinates: Coordinates[]): PolygonCalculation {
  const isValid = coordinates.length >= 3;

  return {
    area: isValid ? calculatePolygonArea(coordinates) : 0,
    center: isValid ? calculatePolygonCenter(coordinates) : DEFAULT_MAP_CENTER,
    isValid
  };
}

// ==============================|| TRANSFORM UTILITIES ||============================== //

/**
 * Transform ForestArea entity to ForestAreaMapData
 */
function transformToMapData(area: ForestArea): ForestAreaMapData {
  const boundary = area.boundary || null;
  const centerCoordinates = boundary?.center || area.coordinates || null;
  const calculatedArea = boundary?.calculatedArea || area.area;

  return {
    id: area.id,
    name: area.name,
    code: area.code,
    boundary,
    calculatedArea,
    centerCoordinates,
    province: area.province,
    status: area.status
  };
}

// ==============================|| USE FOREST AREA MAP HOOK ||============================== //

interface UseForestAreaMapProps {
  initialAreaId?: string; // Pre-select an area
}

/**
 * Hook to manage forest area map view and editing
 * Handles polygon display, editing, area calculation, and navigation
 */
export function useForestAreaMap(props?: UseForestAreaMapProps): UseForestAreaMapReturn {
  const navigate = useNavigate();
  const { initialAreaId } = props || {};

  // ==================== STATE ====================

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<ForestArea[]>([]);

  const [viewState, setViewState] = useState<MapViewState>({
    ...DEFAULT_MAP_VIEW_STATE,
    selectedAreaId: initialAreaId || null
  });

  // Temporary boundary for editing (before save)
  const [editingBoundary, setEditingBoundary] = useState<Coordinates[] | null>(null);

  // Search state
  const [searchValue, setSearchValue] = useState('');

  // ==================== DATA LOADING ====================

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRawData(mockForestAreas);
      } catch {
        setError('Không thể tải dữ liệu bản đồ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==================== COMPUTED VALUES ====================

  // Transform all forest areas to map data
  const allForestAreas = useMemo(() => rawData.map(transformToMapData), [rawData]);

  // Filter forest areas by search value
  const forestAreas = useMemo(() => {
    if (!searchValue.trim()) return allForestAreas;

    const searchLower = searchValue.toLowerCase().trim();
    return allForestAreas.filter(
      (area) =>
        area.name.toLowerCase().includes(searchLower) ||
        area.code.toLowerCase().includes(searchLower) ||
        area.province.toLowerCase().includes(searchLower)
    );
  }, [allForestAreas, searchValue]);

  // Get selected area
  const selectedArea = useMemo(() => {
    if (!viewState.selectedAreaId) return null;
    return allForestAreas.find((area) => area.id === viewState.selectedAreaId) || null;
  }, [allForestAreas, viewState.selectedAreaId]);

  // Map configuration based on selected area
  const mapConfig = useMemo<MapViewConfig>(() => {
    const center = selectedArea?.centerCoordinates || DEFAULT_MAP_CENTER;
    const zoom = selectedArea ? 12 : DEFAULT_MAP_ZOOM;

    return {
      center,
      zoom,
      layers: DEFAULT_MAP_LAYERS.map((layer) => ({
        ...layer,
        visible: layer.id === 'forest-areas' ? viewState.showAreaLayer : layer.visible
      })),
      allowEdit: viewState.mode === 'edit'
    };
  }, [selectedArea, viewState.mode, viewState.showAreaLayer]);

  // ==================== ACTIONS ====================

  // Select a forest area
  const selectArea = useCallback((areaId: string | null) => {
    setViewState((prev) => ({
      ...prev,
      selectedAreaId: areaId,
      mode: 'view',
      hasUnsavedChanges: false,
      isDrawing: false
    }));
    setEditingBoundary(null);
  }, []);

  // Change map mode
  const setMode = useCallback(
    (mode: MapEditMode) => {
      setViewState((prev) => ({
        ...prev,
        mode,
        isDrawing: mode === 'draw'
      }));

      // If entering edit mode, copy current boundary for editing
      if (mode === 'edit' && selectedArea?.boundary) {
        setEditingBoundary([...selectedArea.boundary.coordinates]);
      }
    },
    [selectedArea]
  );

  // Toggle area layer visibility
  const toggleAreaLayer = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      showAreaLayer: !prev.showAreaLayer
    }));
  }, []);

  // ==================== BOUNDARY EDITING ====================

  // Update boundary coordinates during editing
  const updateBoundary = useCallback((coordinates: Coordinates[]) => {
    setEditingBoundary(coordinates);
    setViewState((prev) => ({
      ...prev,
      hasUnsavedChanges: true
    }));
  }, []);

  // Update single point coordinate (for input fields)
  const updatePointCoordinate = useCallback((index: number, coord: Coordinates) => {
    setEditingBoundary((prev) => {
      if (!prev) return prev;
      const newCoords = [...prev];
      newCoords[index] = coord;
      // If updating first point, also update last point (closed polygon)
      if (index === 0 && prev.length > 1) {
        newCoords[prev.length - 1] = coord;
      }
      // If updating last point, also update first point
      if (index === prev.length - 1 && prev.length > 1) {
        newCoords[0] = coord;
      }
      return newCoords;
    });
    setViewState((prev) => ({
      ...prev,
      hasUnsavedChanges: true
    }));
  }, []);

  // Add new point to polygon
  const addPoint = useCallback((coord: Coordinates) => {
    setEditingBoundary((prev) => {
      if (!prev) return [coord];
      // Insert before last point (to maintain closed polygon)
      const newCoords = [...prev];
      newCoords.splice(prev.length - 1, 0, coord);
      return newCoords;
    });
    setViewState((prev) => ({
      ...prev,
      hasUnsavedChanges: true
    }));
  }, []);

  // Remove point from polygon
  const removePoint = useCallback((index: number) => {
    setEditingBoundary((prev) => {
      if (!prev || prev.length <= 4) return prev; // Need at least 3 points + closing point
      const newCoords = [...prev];
      // Don't allow removing first or last point directly
      if (index === 0 || index === prev.length - 1) {
        // Remove second point instead
        newCoords.splice(1, 1);
      } else {
        newCoords.splice(index, 1);
      }
      return newCoords;
    });
    setViewState((prev) => ({
      ...prev,
      hasUnsavedChanges: true
    }));
  }, []);

  // Save boundary changes
  const saveBoundary = useCallback(async (): Promise<boolean> => {
    if (!viewState.selectedAreaId || !editingBoundary) {
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Calculate new area and center
      const calculation = calculatePolygon(editingBoundary);

      if (!calculation.isValid) {
        setError('Polygon không hợp lệ. Cần ít nhất 3 điểm.');
        return false;
      }

      // Simulate API save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local data (in real app, this would come from API response)
      setRawData((prev) =>
        prev.map((area) =>
          area.id === viewState.selectedAreaId
            ? {
                ...area,
                boundary: {
                  coordinates: editingBoundary,
                  center: calculation.center,
                  calculatedArea: calculation.area
                }
              }
            : area
        )
      );

      // Reset edit state
      setViewState((prev) => ({
        ...prev,
        mode: 'view',
        hasUnsavedChanges: false,
        isDrawing: false
      }));
      setEditingBoundary(null);

      return true;
    } catch {
      setError('Không thể lưu ranh giới. Vui lòng thử lại.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [viewState.selectedAreaId, editingBoundary]);

  // Cancel editing and revert changes
  const cancelEdit = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      mode: 'view',
      hasUnsavedChanges: false,
      isDrawing: false
    }));
    setEditingBoundary(null);
  }, []);

  // ==================== NAVIGATION ====================

  const navigateToDetail = useCallback(
    (areaId: string) => {
      navigate(FOREST_AREA_URLS.DETAIL(areaId));
    },
    [navigate]
  );

  const navigateToList = useCallback(() => {
    navigate(FOREST_AREA_URLS.LIST);
  }, [navigate]);

  // ==================== RETURN ====================

  return {
    // Data
    forestAreas,
    allForestAreas,
    selectedArea,
    mapConfig,

    // State
    viewState,
    isLoading,
    isSaving,
    error,

    // Search
    searchValue,
    setSearchValue,

    // Actions
    selectArea,
    setMode,
    toggleAreaLayer,

    // Boundary editing
    updateBoundary,
    saveBoundary,
    cancelEdit,

    // Point editing
    editingBoundary,
    updatePointCoordinate,
    addPoint,
    removePoint,

    // Navigation
    navigateToDetail,
    navigateToList
  };
}

export default useForestAreaMap;
