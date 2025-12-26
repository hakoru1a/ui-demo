// ==============================|| FOREST AREA SINGLE MAP VIEWER COMPONENT ||============================== //
// Simplified map viewer for displaying a single forest area in Create/Edit/Detail pages

import { Box, Paper, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';

import { calculatePolygonCenter } from '../hooks/useForestAreaMap';
import type { ForestAreaFormData, ForestArea, Coordinates } from '../types';
import { DEFAULT_MAP_CENTER } from '../types/map';

// ==============================|| TYPES ||============================== //

interface ForestAreaSingleMapViewerProps {
  formData?: ForestAreaFormData;
  forestArea?: ForestArea;
  height?: number | string;
  showEditControls?: boolean;
  onBoundaryChange?: (coordinates: Coordinates[]) => void;
}

interface MapPoint {
  x: number;
  y: number;
}

// ==============================|| COORDINATE UTILITIES ||============================== //

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

function calculateBounds(coordinates: Coordinates[]): {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
} {
  if (coordinates.length === 0) {
    return {
      minLat: DEFAULT_MAP_CENTER.latitude - 0.1,
      maxLat: DEFAULT_MAP_CENTER.latitude + 0.1,
      minLng: DEFAULT_MAP_CENTER.longitude - 0.1,
      maxLng: DEFAULT_MAP_CENTER.longitude + 0.1
    };
  }

  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;

  coordinates.forEach((coord) => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  const latPadding = (maxLat - minLat) * 0.1 || 0.1;
  const lngPadding = (maxLng - minLng) * 0.1 || 0.1;

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding
  };
}

// ==============================|| FOREST AREA SINGLE MAP VIEWER ||============================== //

const ForestAreaSingleMapViewer = ({
  formData,
  forestArea,
  height = 400,
  showEditControls = false,
  onBoundaryChange
}: ForestAreaSingleMapViewerProps) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Get boundary coordinates from formData or forestArea
  const boundaryCoordinates = useMemo<Coordinates[]>(() => {
    if (forestArea?.boundary?.coordinates) {
      return forestArea.boundary.coordinates;
    }
    // For new areas, could return empty or default
    return [];
  }, [forestArea]);

  // Calculate bounds
  const bounds = useMemo(() => {
    if (boundaryCoordinates.length > 0) {
      return calculateBounds(boundaryCoordinates);
    }
    // Default bounds if no coordinates
    const center = forestArea?.coordinates || formData?.province ? DEFAULT_MAP_CENTER : DEFAULT_MAP_CENTER;
    return {
      minLat: center.latitude - 0.1,
      maxLat: center.latitude + 0.1,
      minLng: center.longitude - 0.1,
      maxLng: center.longitude + 0.1
    };
  }, [boundaryCoordinates, forestArea, formData]);

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

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = dimensions;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = theme.palette.mode === 'dark' ? '#333' : '#e0e0e0';
    ctx.lineWidth = 1;
    for (let x = 40; x < canvasWidth; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 40; y < canvasHeight; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw boundary if available
    if (boundaryCoordinates.length >= 3) {
      const points = boundaryCoordinates.map((coord) => latLngToPoint(coord, bounds, canvasWidth, canvasHeight));

      // Draw polygon
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.closePath();

      // Fill
      const status = forestArea?.status || formData?.status || 'active';
      const baseColor = status === 'active' ? theme.palette.success.main : theme.palette.grey[500];
      ctx.fillStyle = alpha(baseColor, 0.3);
      ctx.fill();

      // Stroke
      ctx.strokeStyle = theme.palette.primary.main;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw center marker
      const center = calculatePolygonCenter(boundaryCoordinates);
      const centerPoint = latLngToPoint(center, bounds, canvasWidth, canvasHeight);

      // Outer pulse circle
      ctx.beginPath();
      ctx.arc(centerPoint.x, centerPoint.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = alpha(theme.palette.primary.main, 0.2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerPoint.x, centerPoint.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = alpha(theme.palette.primary.main, 0.3);
      ctx.fill();

      // Main marker
      ctx.beginPath();
      ctx.arc(centerPoint.x, centerPoint.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = theme.palette.primary.main;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(centerPoint.x, centerPoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Draw corner points with numbers
      points.forEach((point, index) => {
        // Draw point circle
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = hoveredPointIndex === index ? theme.palette.error.main : theme.palette.warning.main;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw point number
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(index + 1), point.x, point.y);
      });
    } else {
      // Show placeholder message
      ctx.fillStyle = theme.palette.text.secondary;
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Chưa có dữ liệu bản đồ', canvasWidth / 2, canvasHeight / 2);
    }
  }, [dimensions, boundaryCoordinates, bounds, theme, forestArea, formData, hoveredPointIndex]);

  // Handle mouse move for tooltip
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (boundaryCoordinates.length === 0) {
        setHoveredPointIndex(null);
        setTooltipPosition(null);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width: canvasWidth, height: canvasHeight } = dimensions;

      const points = boundaryCoordinates.map((coord) => latLngToPoint(coord, bounds, canvasWidth, canvasHeight));

      // Check if mouse is near any corner point
      let foundIndex: number | null = null;
      for (let i = 0; i < points.length; i++) {
        const dist = Math.sqrt((x - points[i].x) ** 2 + (y - points[i].y) ** 2);
        if (dist < 15) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== null) {
        setHoveredPointIndex(foundIndex);
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          setTooltipPosition({ x: e.clientX - containerRect.left, y: e.clientY - containerRect.top });
        }
      } else {
        setHoveredPointIndex(null);
        setTooltipPosition(null);
      }
    },
    [boundaryCoordinates, bounds, dimensions]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setHoveredPointIndex(null);
    setTooltipPosition(null);
  }, []);

  if (boundaryCoordinates.length === 0 && !forestArea && !formData) {
    return (
      <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Chưa có dữ liệu bản đồ để hiển thị
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Bản đồ
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          height,
          overflow: 'hidden',
          borderRadius: 2,
          position: 'relative'
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'block', width: '100%', height: '100%', cursor: hoveredPointIndex !== null ? 'pointer' : 'default' }}
          />

          {/* Tooltip for corner points */}
          {hoveredPointIndex !== null && tooltipPosition && boundaryCoordinates[hoveredPointIndex] && (
            <Box
              sx={{
                position: 'absolute',
                left: tooltipPosition.x,
                top: tooltipPosition.y - 10,
                transform: 'translate(-50%, -100%)',
                bgcolor: 'background.paper',
                p: 1,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 2,
                zIndex: 1300,
                pointerEvents: 'none',
                mb: 1
              }}
            >
              <Typography variant="caption" fontWeight={600} display="block">
                Điểm {hoveredPointIndex + 1}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Lat: {boundaryCoordinates[hoveredPointIndex].latitude.toFixed(6)}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Lng: {boundaryCoordinates[hoveredPointIndex].longitude.toFixed(6)}
              </Typography>
            </Box>
          )}
          {boundaryCoordinates.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                bgcolor: 'background.paper',
                p: 1,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {forestArea?.name || formData?.name || 'Vùng trồng'}
              </Typography>
              {forestArea?.boundary?.calculatedArea && (
                <Typography variant="caption" display="block" color="text.secondary">
                  Diện tích: {forestArea.boundary.calculatedArea.toFixed(2)} ha
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ForestAreaSingleMapViewer;
