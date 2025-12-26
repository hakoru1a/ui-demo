// ==============================|| FOREST AREA MAP VIEWER COMPONENT ||============================== //

import { EnvironmentOutlined, EditOutlined, EyeOutlined, AimOutlined, SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  alpha,
  useTheme,
  InputBase
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Coordinates, ForestAreaMapData, MapViewConfig, MapEditMode } from '../types';

// ==============================|| TYPES ||============================== //

interface ForestAreaMapViewerProps {
  forestAreas: ForestAreaMapData[];
  selectedArea: ForestAreaMapData | null;
  mapConfig: MapViewConfig;
  mode: MapEditMode;
  showAreaLayer: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectArea: (areaId: string | null) => void;
  onBoundaryChange?: (coordinates: Coordinates[]) => void;
  height?: number | string;
}

interface MapPoint {
  x: number;
  y: number;
}

// ==============================|| COORDINATE UTILITIES ||============================== //

/**
 * Convert lat/lng to canvas coordinates
 */
function latLngToPoint(
  coord: Coordinates,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
  padding: number = 40
): MapPoint {
  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const x = padding + ((coord.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * effectiveWidth;
  const y = padding + ((bounds.maxLat - coord.latitude) / (bounds.maxLat - bounds.minLat)) * effectiveHeight;

  return { x, y };
}

/**
 * Calculate bounds from all coordinates
 */
function calculateBounds(areas: ForestAreaMapData[]): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;

  areas.forEach((area) => {
    if (area.boundary?.coordinates) {
      area.boundary.coordinates.forEach((coord) => {
        minLat = Math.min(minLat, coord.latitude);
        maxLat = Math.max(maxLat, coord.latitude);
        minLng = Math.min(minLng, coord.longitude);
        maxLng = Math.max(maxLng, coord.longitude);
      });
    } else if (area.centerCoordinates) {
      const offset = 0.05;
      minLat = Math.min(minLat, area.centerCoordinates.latitude - offset);
      maxLat = Math.max(maxLat, area.centerCoordinates.latitude + offset);
      minLng = Math.min(minLng, area.centerCoordinates.longitude - offset);
      maxLng = Math.max(maxLng, area.centerCoordinates.longitude + offset);
    }
  });

  // Add padding to bounds
  const latPadding = (maxLat - minLat) * 0.1 || 0.1;
  const lngPadding = (maxLng - minLng) * 0.1 || 0.1;

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding
  };
}

// ==============================|| MAP CANVAS COMPONENT ||============================== //

interface MapCanvasProps {
  forestAreas: ForestAreaMapData[];
  selectedArea: ForestAreaMapData | null;
  showAreaLayer: boolean;
  mode: MapEditMode;
  onSelectArea: (areaId: string | null) => void;
  onBoundaryChange?: (coordinates: Coordinates[]) => void;
}

const MapCanvas = ({ forestAreas, selectedArea, showAreaLayer, mode, onSelectArea, onBoundaryChange }: MapCanvasProps) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [editingPoints, setEditingPoints] = useState<Coordinates[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Calculate bounds
  const bounds = calculateBounds(forestAreas.length > 0 ? forestAreas : []);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize editing points when mode changes
  useEffect(() => {
    if (mode === 'edit' && selectedArea?.boundary?.coordinates) {
      setEditingPoints([...selectedArea.boundary.coordinates]);
    } else if (mode === 'view') {
      setEditingPoints([]);
    }
  }, [mode, selectedArea]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = theme.palette.mode === 'dark' ? '#333' : '#e0e0e0';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!showAreaLayer) return;

    // Draw forest areas
    forestAreas.forEach((area) => {
      if (!area.boundary?.coordinates || area.boundary.coordinates.length < 3) return;

      const isSelected = area.id === selectedArea?.id;
      const points = area.boundary.coordinates.map((coord) => latLngToPoint(coord, bounds, width, height));

      // Draw polygon
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.closePath();

      // Fill
      const baseColor = area.status === 'active' ? theme.palette.success.main : theme.palette.grey[500];
      ctx.fillStyle = alpha(baseColor, isSelected ? 0.4 : 0.2);
      ctx.fill();

      // Stroke
      ctx.strokeStyle = isSelected ? theme.palette.primary.main : baseColor;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Draw center marker
      if (area.centerCoordinates) {
        const center = latLngToPoint(area.centerCoordinates, bounds, width, height);
        ctx.beginPath();
        ctx.arc(center.x, center.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? theme.palette.primary.main : baseColor;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw editing points
    if (mode === 'edit' && editingPoints.length > 0) {
      const points = editingPoints.map((coord) => latLngToPoint(coord, bounds, width, height));

      // Draw polygon
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.closePath();

      ctx.fillStyle = alpha(theme.palette.warning.main, 0.3);
      ctx.fill();
      ctx.strokeStyle = theme.palette.warning.main;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw draggable points
      points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = dragIndex === index ? theme.palette.error.main : theme.palette.warning.main;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }, [dimensions, forestAreas, selectedArea, showAreaLayer, mode, editingPoints, dragIndex, bounds, theme]);

  // Handle click to select area
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mode === 'edit') return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = dimensions;

      // Check if click is inside any polygon
      for (const area of forestAreas) {
        if (!area.boundary?.coordinates || area.boundary.coordinates.length < 3) continue;

        const points = area.boundary.coordinates.map((coord) => latLngToPoint(coord, bounds, width, height));

        // Point in polygon check
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
          const xi = points[i].x,
            yi = points[i].y;
          const xj = points[j].x,
            yj = points[j].y;

          if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
            inside = !inside;
          }
        }

        if (inside) {
          onSelectArea(area.id);
          return;
        }
      }

      // Click outside - deselect
      onSelectArea(null);
    },
    [mode, forestAreas, bounds, dimensions, onSelectArea]
  );

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mode !== 'edit' || editingPoints.length === 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = dimensions;

      // Check if clicking on a point
      const points = editingPoints.map((coord) => latLngToPoint(coord, bounds, width, height));
      for (let i = 0; i < points.length; i++) {
        const dist = Math.sqrt((x - points[i].x) ** 2 + (y - points[i].y) ** 2);
        if (dist < 12) {
          setDragIndex(i);
          return;
        }
      }
    },
    [mode, editingPoints, bounds, dimensions]
  );

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (dragIndex === null) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = dimensions;
      const padding = 40;

      // Convert canvas point back to coordinates
      const effectiveWidth = width - padding * 2;
      const effectiveHeight = height - padding * 2;

      const lng = bounds.minLng + ((x - padding) / effectiveWidth) * (bounds.maxLng - bounds.minLng);
      const lat = bounds.maxLat - ((y - padding) / effectiveHeight) * (bounds.maxLat - bounds.minLat);

      setEditingPoints((prev) => {
        const newPoints = [...prev];
        newPoints[dragIndex] = { latitude: lat, longitude: lng };

        // If first/last point, update both (closed polygon)
        if (dragIndex === 0 && prev.length > 1) {
          newPoints[prev.length - 1] = { latitude: lat, longitude: lng };
        } else if (dragIndex === prev.length - 1 && prev.length > 1) {
          newPoints[0] = { latitude: lat, longitude: lng };
        }

        return newPoints;
      });
    },
    [dragIndex, bounds, dimensions]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (dragIndex !== null) {
      setDragIndex(null);
      onBoundaryChange?.(editingPoints);
    }
  }, [dragIndex, editingPoints, onBoundaryChange]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        position: 'relative',
        cursor: mode === 'edit' ? 'crosshair' : 'pointer'
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {/* Map mode indicator */}
      <Chip
        icon={mode === 'edit' ? <EditOutlined /> : <EyeOutlined />}
        label={mode === 'edit' ? 'Chế độ chỉnh sửa' : 'Chế độ xem'}
        size="small"
        color={mode === 'edit' ? 'warning' : 'default'}
        sx={{ position: 'absolute', top: 8, left: 8 }}
      />

      {/* Coordinates display */}
      {selectedArea?.centerCoordinates && (
        <Chip
          icon={<AimOutlined />}
          label={`${selectedArea.centerCoordinates.latitude.toFixed(4)}, ${selectedArea.centerCoordinates.longitude.toFixed(4)}`}
          size="small"
          variant="outlined"
          sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'background.paper' }}
        />
      )}
    </Box>
  );
};

// ==============================|| AREA LIST SIDEBAR ||============================== //

interface AreaListSidebarProps {
  forestAreas: ForestAreaMapData[];
  selectedArea: ForestAreaMapData | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectArea: (areaId: string | null) => void;
}

const AreaListSidebar = ({ forestAreas, selectedArea, searchValue, onSearchChange, onSelectArea }: AreaListSidebarProps) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        width: 280,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: `1px solid ${theme.palette.divider}`
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Danh sách vùng rừng
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {forestAreas.length} vùng
        </Typography>
      </Box>

      {/* Search Box */}
      <Box sx={{ px: 1.5, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            '&:focus-within': {
              borderColor: theme.palette.primary.main,
              bgcolor: 'background.paper'
            }
          }}
        >
          <SearchOutlined style={{ color: theme.palette.text.secondary, fontSize: 16 }} />
          <InputBase
            placeholder="Tìm theo tên, mã, tỉnh..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              fontSize: '0.875rem',
              '& input': {
                py: 0.5
              }
            }}
          />
          {searchValue && (
            <IconButton size="small" onClick={() => onSearchChange('')} sx={{ p: 0.25 }}>
              <CloseCircleOutlined style={{ fontSize: 14, color: theme.palette.text.secondary }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {forestAreas.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchValue ? 'Không tìm thấy vùng rừng phù hợp' : 'Chưa có vùng rừng nào'}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {forestAreas.map((area, index) => (
              <Box key={area.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={area.id === selectedArea?.id}
                    onClick={() => onSelectArea(area.id)}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderLeft: `3px solid ${theme.palette.primary.main}`
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <EnvironmentOutlined
                            style={{ color: area.status === 'active' ? theme.palette.success.main : theme.palette.grey[500] }}
                          />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                            {area.name}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {area.code} • {area.calculatedArea} ha
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < forestAreas.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

// ==============================|| MAIN COMPONENT ||============================== //

const ForestAreaMapViewer = ({
  forestAreas,
  selectedArea,
  mapConfig,
  mode,
  showAreaLayer,
  searchValue,
  onSearchChange,
  onSelectArea,
  onBoundaryChange,
  height = 500
}: ForestAreaMapViewerProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        height,
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      {/* Sidebar */}
      <AreaListSidebar
        forestAreas={forestAreas}
        selectedArea={selectedArea}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSelectArea={onSelectArea}
      />

      {/* Map */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <MapCanvas
          forestAreas={forestAreas}
          selectedArea={selectedArea}
          showAreaLayer={showAreaLayer}
          mode={mode}
          onSelectArea={onSelectArea}
          onBoundaryChange={onBoundaryChange}
        />
      </Box>
    </Paper>
  );
};

export default ForestAreaMapViewer;
