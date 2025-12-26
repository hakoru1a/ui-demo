// ==============================|| FOREST AREAS MAP PAGE ||============================== //

import { SaveOutlined, EditOutlined, EyeOutlined, ArrowLeftOutlined, CloseOutlined, EnvironmentOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useCallback } from 'react';

// project imports
import MainCard from 'components/MainCard';

import CoordinateEditor from '../components/CoordinateEditor';
import ForestAreaMapViewer from '../components/ForestAreaMapViewer';
import { useForestAreaMap } from '../hooks/useForestAreaMap';

// ==============================|| FOREST AREAS MAP PAGE ||============================== //

const ForestAreasMapPage = () => {
  // Use map hook for all logic
  const {
    forestAreas,
    selectedArea,
    mapConfig,
    viewState,
    isLoading,
    isSaving,
    error,
    searchValue,
    setSearchValue,
    selectArea,
    setMode,
    toggleAreaLayer,
    updateBoundary,
    saveBoundary,
    cancelEdit,
    editingBoundary,
    updatePointCoordinate,
    addPoint,
    removePoint,
    navigateToDetail,
    navigateToList
  } = useForestAreaMap();

  // Handle save boundary
  const handleSaveBoundary = useCallback(async () => {
    const success = await saveBoundary();
    if (success) {
      // Optionally show success message
    }
  }, [saveBoundary]);

  // Handle edit mode
  const handleStartEdit = useCallback(() => {
    if (selectedArea) {
      setMode('edit');
    }
  }, [selectedArea, setMode]);

  // Handle view detail
  const handleViewDetail = useCallback(() => {
    if (selectedArea) {
      navigateToDetail(selectedArea.id);
    }
  }, [selectedArea, navigateToDetail]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Bản đồ vùng rừng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" spacing={1}>
          <EnvironmentOutlined />
          <span>Bản đồ vùng rừng</span>
          {selectedArea && (
            <Chip label={selectedArea.name} size="small" color="primary" variant="outlined" onDelete={() => selectArea(null)} />
          )}
        </Stack>
      }
      secondary={
        <Stack direction="row" spacing={1}>
          {/* Back to list - Always available */}
          <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={navigateToList}>
            Quay lại danh sách
          </Button>

          {/* View detail - Always available when area selected */}
          {selectedArea && viewState.mode === 'view' && (
            <Button variant="outlined" startIcon={<EyeOutlined />} onClick={handleViewDetail}>
              Xem chi tiết vùng
            </Button>
          )}

          {/* Edit boundary - View mode only */}
          {selectedArea && viewState.mode === 'view' && (
            <Button variant="outlined" color="warning" startIcon={<EditOutlined />} onClick={handleStartEdit}>
              Chỉnh sửa ranh giới
            </Button>
          )}

          {/* Cancel edit - Edit mode only */}
          {viewState.mode === 'edit' && (
            <Button variant="outlined" color="error" startIcon={<CloseOutlined />} onClick={cancelEdit} disabled={isSaving}>
              Hủy
            </Button>
          )}

          {/* Save boundary - Edit mode only */}
          {viewState.mode === 'edit' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveOutlined />}
              onClick={handleSaveBoundary}
              disabled={isSaving || !viewState.hasUnsavedChanges}
            >
              Lưu bản đồ
            </Button>
          )}
        </Stack>
      }
    >
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Unsaved changes warning */}
      {viewState.hasUnsavedChanges && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Bạn có thay đổi chưa lưu. Nhấn "Lưu bản đồ" để lưu hoặc "Hủy" để hủy thay đổi.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Map Viewer */}
        <Grid size={12}>
          <ForestAreaMapViewer
            forestAreas={forestAreas}
            selectedArea={selectedArea}
            mapConfig={mapConfig}
            mode={viewState.mode}
            showAreaLayer={viewState.showAreaLayer}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSelectArea={selectArea}
            onBoundaryChange={updateBoundary}
            height={500}
          />
        </Grid>

        {/* Coordinate Editor - Only show in edit mode */}
        {viewState.mode === 'edit' && selectedArea && (
          <Grid size={12}>
            <CoordinateEditor
              coordinates={editingBoundary}
              onUpdatePoint={updatePointCoordinate}
              onAddPoint={addPoint}
              onRemovePoint={removePoint}
              disabled={isSaving}
            />
          </Grid>
        )}

        {/* Map Info Panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Thông tin vùng trồng
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {selectedArea ? (
              <Stack spacing={2}>
                {/* Calculated Area */}
                <TextField
                  label="Diện tích tính toán"
                  value={`${selectedArea.calculatedArea} ha`}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                  helperText="Tự động tính từ bản đồ"
                />

                {/* Center Coordinates */}
                <TextField
                  label="Tọa độ trung tâm"
                  value={
                    selectedArea.centerCoordinates
                      ? `${selectedArea.centerCoordinates.latitude.toFixed(6)}, ${selectedArea.centerCoordinates.longitude.toFixed(6)}`
                      : 'Chưa xác định'
                  }
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                  helperText="Tự động tính từ bản đồ"
                />

                {/* Province */}
                <TextField
                  label="Tỉnh / Khu vực"
                  value={selectedArea.province}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      readOnly: true
                    }
                  }}
                />

                {/* Status */}
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedArea.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                      color={selectedArea.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Stack>
            ) : (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                Chọn một vùng trồng trên bản đồ để xem thông tin
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Map Controls */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Điều khiển bản đồ
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {/* Layer visibility toggle */}
              <FormControlLabel
                control={<Switch checked={viewState.showAreaLayer} onChange={toggleAreaLayer} color="primary" />}
                label="Hiển thị lớp vùng rừng"
              />

              {/* Mode indicator */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Chế độ hiện tại
                </Typography>
                <Chip
                  icon={viewState.mode === 'edit' ? <EditOutlined /> : <EyeOutlined />}
                  label={viewState.mode === 'edit' ? 'Chỉnh sửa ranh giới' : 'Xem bản đồ'}
                  color={viewState.mode === 'edit' ? 'warning' : 'default'}
                  variant="outlined"
                />
              </Box>

              {/* Edit instructions */}
              {viewState.mode === 'edit' && (
                <Alert severity="info" variant="outlined">
                  <Typography variant="body2">
                    <strong>Hướng dẫn chỉnh sửa:</strong>
                  </Typography>
                  <Typography variant="caption" component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                    <li>Kéo các điểm màu cam để thay đổi ranh giới</li>
                    <li>Nhấn "Lưu bản đồ" khi hoàn tất</li>
                    <li>Nhấn "Hủy" để hủy thay đổi</li>
                  </Typography>
                </Alert>
              )}

              {/* Quick actions */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Thao tác nhanh
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button size="small" variant="outlined" onClick={() => selectArea(null)} disabled={!selectedArea}>
                    Bỏ chọn vùng
                  </Button>
                  {selectedArea && (
                    <Button size="small" variant="outlined" color="primary" onClick={handleViewDetail}>
                      Chi tiết
                    </Button>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ForestAreasMapPage;
