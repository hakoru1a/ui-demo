// ==============================|| TRACKING PAGE ||============================== //

import { ReloadOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Paper, Typography, Chip, Grid, CircularProgress, Alert } from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import { DISPATCH_ORDER_URLS as DISPATCH_URLS } from '../../dispatching/types/constants';
import TrackingMapViewer from '../components/TrackingMapViewer';
import { getMockTrackingStatus } from '../mock/trackingData';
import type { TrackingStatus } from '../types';
import { TRACKING_STATUS_OPTIONS } from '../types/constants';

// Import DISPATCH_ORDER_URLS from dispatching feature

// ==============================|| TRACKING PAGE ||============================== //

const TrackingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tracking data
  const fetchTrackingData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get mock data
        const data = getMockTrackingStatus();

        // If orderId is provided, filter by orderId
        if (orderId && data.orderId !== orderId) {
          setError('Không tìm thấy thông tin tracking cho lệnh này');
          setTrackingStatus(null);
        } else {
          // Simulate position update (move slightly)
          const updatedData: TrackingStatus = {
            ...data,
            currentPosition: {
              ...data.currentPosition,
              latitude: data.currentPosition.latitude + (Math.random() - 0.5) * 0.001,
              longitude: data.currentPosition.longitude + (Math.random() - 0.5) * 0.001,
              timestamp: new Date()
            },
            currentSpeed: data.currentSpeed + (Math.random() - 0.5) * 5,
            lastUpdated: new Date()
          };
          setTrackingStatus(updatedData);
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu tracking');
        console.error('Error fetching tracking data:', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [orderId]
  );

  // Initial load
  useEffect(() => {
    fetchTrackingData();
  }, [fetchTrackingData]);

  // Auto refresh every 5 seconds
  useEffect(() => {
    if (!trackingStatus) return;

    const interval = setInterval(() => {
      fetchTrackingData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [trackingStatus, fetchTrackingData]);

  // Handle refresh position
  const handleRefreshPosition = useCallback(() => {
    fetchTrackingData(true);
  }, [fetchTrackingData]);

  // Handle view order info
  const handleViewOrder = useCallback(() => {
    if (trackingStatus?.orderId) {
      navigate(DISPATCH_URLS.DETAIL(trackingStatus.orderId));
    }
  }, [navigate, trackingStatus]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Get status label
  const getStatusLabel = (status: TrackingStatus['status']) => {
    return TRACKING_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
  };

  // Get status color
  const getStatusColor = (status: TrackingStatus['status']) => {
    switch (status) {
      case 'moving':
        return 'info';
      case 'stopped':
        return 'warning';
      case 'arrived':
        return 'success';
      default:
        return 'default';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Tracking lộ trình">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error || !trackingStatus) {
    return (
      <MainCard
        title="Tracking lộ trình"
        secondary={
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        }
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Không tìm thấy dữ liệu tracking'}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại
        </Button>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Tracking lộ trình"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
          <Button variant="outlined" color="info" startIcon={<EyeOutlined />} onClick={handleViewOrder}>
            Xem thông tin lệnh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReloadOutlined />}
            onClick={handleRefreshPosition}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Đang làm mới...' : 'Làm mới vị trí'}
          </Button>
        </Stack>
      }
    >
      <Grid container spacing={3}>
        {/* Map Viewer */}
        <Grid size={12}>
          <Paper variant="outlined" sx={{ p: 1, height: 500 }}>
            <TrackingMapViewer trackingStatus={trackingStatus} height="100%" showRoute={showRoute} />
          </Paper>
        </Grid>

        {/* Information Panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Thông tin vị trí
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Vị trí hiện tại
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {trackingStatus.currentPosition.latitude.toFixed(6)}, {trackingStatus.currentPosition.longitude.toFixed(6)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái vận chuyển
                </Typography>
                <Chip
                  label={getStatusLabel(trackingStatus.status)}
                  color={getStatusColor(trackingStatus.status) as any}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tốc độ hiện tại
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {trackingStatus.currentSpeed.toFixed(1)} km/h
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Cập nhật lần cuối
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {dateHelper.formatDateTime(trackingStatus.lastUpdated)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Order Info Panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Thông tin lệnh
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Mã lệnh
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                  onClick={handleViewOrder}
                >
                  {trackingStatus.orderCode}
                </Typography>
              </Box>
              {trackingStatus.route && (
                <>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Điểm xuất phát
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {trackingStatus.route.waypoints[0]?.latitude.toFixed(4)}, {trackingStatus.route.waypoints[0]?.longitude.toFixed(4)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Điểm đến
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {trackingStatus.route.waypoints[trackingStatus.route.waypoints.length - 1]?.latitude.toFixed(4)},{' '}
                      {trackingStatus.route.waypoints[trackingStatus.route.waypoints.length - 1]?.longitude.toFixed(4)}
                    </Typography>
                  </Box>
                  {trackingStatus.route.estimatedArrival && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Thời gian dự kiến đến
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {dateHelper.formatDateTime(trackingStatus.route.estimatedArrival)}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default TrackingPage;
