// ==============================|| COORDINATE EDITOR COMPONENT ||============================== //

import { PlusOutlined, DeleteOutlined, AimOutlined } from '@ant-design/icons';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  Divider,
  Button,
  Chip,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import { useCallback, useState } from 'react';

import { calculatePolygonArea, calculatePolygonCenter } from '../hooks/useForestAreaMap';
import type { Coordinates } from '../types';

// ==============================|| TYPES ||============================== //

interface CoordinateEditorProps {
  coordinates: Coordinates[] | null;
  onUpdatePoint: (index: number, coord: Coordinates) => void;
  onAddPoint: (coord: Coordinates) => void;
  onRemovePoint: (index: number) => void;
  disabled?: boolean;
}

// ==============================|| SINGLE POINT EDITOR ||============================== //

interface PointEditorProps {
  index: number;
  coordinate: Coordinates;
  onChange: (index: number, coord: Coordinates) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  disabled?: boolean;
  isFirst?: boolean;
}

const PointEditor = ({ index, coordinate, onChange, onRemove, canRemove, disabled, isFirst }: PointEditorProps) => {
  const theme = useTheme();
  const [localLat, setLocalLat] = useState(coordinate.latitude.toString());
  const [localLng, setLocalLng] = useState(coordinate.longitude.toString());
  const [hasError, setHasError] = useState(false);

  const handleLatChange = useCallback(
    (value: string) => {
      setLocalLat(value);
      const lat = parseFloat(value);
      if (!isNaN(lat) && lat >= -90 && lat <= 90) {
        setHasError(false);
        onChange(index, { latitude: lat, longitude: coordinate.longitude });
      } else {
        setHasError(true);
      }
    },
    [index, coordinate.longitude, onChange]
  );

  const handleLngChange = useCallback(
    (value: string) => {
      setLocalLng(value);
      const lng = parseFloat(value);
      if (!isNaN(lng) && lng >= -180 && lng <= 180) {
        setHasError(false);
        onChange(index, { latitude: coordinate.latitude, longitude: lng });
      } else {
        setHasError(true);
      }
    },
    [index, coordinate.latitude, onChange]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: 1,
        bgcolor: isFirst ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
        border: hasError ? `1px solid ${theme.palette.error.main}` : '1px solid transparent'
      }}
    >
      <Chip label={`${index + 1}`} size="small" color={isFirst ? 'primary' : 'default'} sx={{ minWidth: 32 }} />

      <TextField
        size="small"
        label="Vĩ độ (Lat)"
        value={localLat}
        onChange={(e) => handleLatChange(e.target.value)}
        disabled={disabled}
        error={hasError}
        sx={{ flex: 1 }}
        slotProps={{
          input: {
            sx: { fontSize: '0.875rem' }
          }
        }}
        placeholder="-90 đến 90"
      />

      <TextField
        size="small"
        label="Kinh độ (Lng)"
        value={localLng}
        onChange={(e) => handleLngChange(e.target.value)}
        disabled={disabled}
        error={hasError}
        sx={{ flex: 1 }}
        slotProps={{
          input: {
            sx: { fontSize: '0.875rem' }
          }
        }}
        placeholder="-180 đến 180"
      />

      <Tooltip title={canRemove ? 'Xóa điểm' : 'Cần ít nhất 3 điểm'}>
        <span>
          <IconButton size="small" color="error" onClick={() => onRemove(index)} disabled={disabled || !canRemove}>
            <DeleteOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

// ==============================|| ADD POINT FORM ||============================== //

interface AddPointFormProps {
  onAdd: (coord: Coordinates) => void;
  disabled?: boolean;
}

const AddPointForm = ({ onAdd, disabled }: AddPointFormProps) => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = useCallback(() => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      setError('Vĩ độ không hợp lệ (-90 đến 90)');
      return;
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      setError('Kinh độ không hợp lệ (-180 đến 180)');
      return;
    }

    setError(null);
    onAdd({ latitude, longitude });
    setLat('');
    setLng('');
  }, [lat, lng, onAdd]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary" gutterBottom display="block">
        Thêm điểm mới
      </Typography>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          size="small"
          label="Vĩ độ"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          disabled={disabled}
          placeholder="VD: 12.6768"
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          label="Kinh độ"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          disabled={disabled}
          placeholder="VD: 108.0477"
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          size="small"
          startIcon={<PlusOutlined />}
          onClick={handleAdd}
          disabled={disabled || !lat || !lng}
          sx={{ minWidth: 100, height: 40 }}
        >
          Thêm
        </Button>
      </Stack>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

// ==============================|| MAIN COMPONENT ||============================== //

const CoordinateEditor = ({ coordinates, onUpdatePoint, onAddPoint, onRemovePoint, disabled }: CoordinateEditorProps) => {
  // Don't show last point (it's same as first for closed polygon)
  const displayCoordinates = coordinates?.slice(0, -1) || [];
  const canRemove = displayCoordinates.length > 3;

  // Calculate stats
  const area = coordinates ? calculatePolygonArea(coordinates) : 0;
  const center = coordinates ? calculatePolygonCenter(coordinates) : null;

  if (!coordinates || coordinates.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Alert severity="info">Vùng này chưa có dữ liệu ranh giới. Vui lòng thêm các điểm tọa độ để tạo polygon.</Alert>
        <AddPointForm onAdd={onAddPoint} disabled={disabled} />
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          <AimOutlined style={{ marginRight: 8 }} />
          Tọa độ ranh giới ({displayCoordinates.length} điểm)
        </Typography>
      </Stack>

      {/* Stats */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip size="small" label={`Diện tích: ${area} ha`} color="success" variant="outlined" />
        {center && <Chip size="small" label={`Tâm: ${center.latitude.toFixed(4)}, ${center.longitude.toFixed(4)}`} variant="outlined" />}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Coordinate List */}
      <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
        <Stack spacing={0.5}>
          {displayCoordinates.map((coord, index) => (
            <PointEditor
              key={`${coord.latitude}-${coord.longitude}-${index}`}
              index={index}
              coordinate={coord}
              onChange={onUpdatePoint}
              onRemove={onRemovePoint}
              canRemove={canRemove}
              disabled={disabled}
              isFirst={index === 0}
            />
          ))}
        </Stack>
      </Box>

      {/* Add Point Form */}
      {!disabled && <AddPointForm onAdd={onAddPoint} disabled={disabled} />}

      {/* Help text */}
      <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
        <Typography variant="caption">
          <strong>Lưu ý:</strong> Polygon cần ít nhất 3 điểm. Điểm đầu và cuối sẽ tự động nối lại.
          <br />
          Tọa độ theo chuẩn WGS84 (Google Maps, GPS).
        </Typography>
      </Alert>
    </Paper>
  );
};

export default CoordinateEditor;
