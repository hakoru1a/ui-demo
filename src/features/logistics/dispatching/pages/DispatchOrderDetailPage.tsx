import { EditOutlined, ArrowLeftOutlined, PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import DispatchOrderForm from '../components/DispatchOrderForm';
import { mockDispatchOrders } from '../mock/dispatchOrders';
import type { DispatchOrderFormData, DispatchOrder } from '../types';
import { DISPATCH_ORDER_URLS } from '../types/constants';
import { dispatchOrderDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: DispatchOrder): DispatchOrderFormData => ({
  orderCode: entity.orderCode,
  vehicleId: entity.vehicleId,
  driverName: entity.driverName,
  origin: entity.origin,
  destination: entity.destination,
  departureTime: entity.departureTime,
  estimatedDuration: entity.estimatedDuration,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| DISPATCH ORDER DETAIL PAGE ||============================== //

const DispatchOrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DispatchOrder | null>(null);
  const [initialValues, setInitialValues] = useState<DispatchOrderFormData>(dispatchOrderDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = mockDispatchOrders.find((item) => item.id === id);

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy lệnh điều động');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle edit navigation
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(DISPATCH_ORDER_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle start transport
  const handleStartTransport = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn bắt đầu vận chuyển?')) {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Bắt đầu vận chuyển thành công! (Mock)');
      // Refresh data
      if (id) {
        const found = mockDispatchOrders.find((item) => item.id === id);
        if (found) {
          setData({ ...found, status: 'running' });
          setInitialValues({ ...entityToFormData(found), status: 'running' });
        }
      }
    }
  }, [id]);

  // Handle complete transport
  const handleCompleteTransport = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn hoàn thành vận chuyển?')) {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Hoàn thành vận chuyển thành công! (Mock)');
      // Refresh data
      if (id) {
        const found = mockDispatchOrders.find((item) => item.id === id);
        if (found) {
          setData({ ...found, status: 'completed' });
          setInitialValues({ ...entityToFormData(found), status: 'completed' });
        }
      }
    }
  }, [id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(DISPATCH_ORDER_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết lệnh điều động">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết lệnh điều động">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  const canStartTransport = data?.status === 'new';
  const canCompleteTransport = data?.status === 'running';

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}} // No submit for view mode
      enableReinitialize
    >
      <Form>
        <MainCard
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <span>{data?.orderCode}</span>
              <Chip
                label={data?.status === 'new' ? 'Mới' : data?.status === 'running' ? 'Đang chạy' : 'Hoàn thành'}
                color={data?.status === 'new' ? 'default' : data?.status === 'running' ? 'info' : 'success'}
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              {canStartTransport && (
                <Button variant="contained" color="info" startIcon={<PlayCircleOutlined />} onClick={handleStartTransport}>
                  Bắt đầu vận chuyển
                </Button>
              )}
              {canCompleteTransport && (
                <Button variant="contained" color="success" startIcon={<CheckCircleOutlined />} onClick={handleCompleteTransport}>
                  Hoàn thành
                </Button>
              )}
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <DispatchOrderForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default DispatchOrderDetailPage;
