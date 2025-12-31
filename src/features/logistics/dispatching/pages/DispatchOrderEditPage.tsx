import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
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
import { dispatchOrderSchema, dispatchOrderDefaultValues } from '../validation';

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

// ==============================|| DISPATCH ORDER EDIT PAGE ||============================== //

const DispatchOrderEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<DispatchOrderFormData>(dispatchOrderDefaultValues);
  const [originalData, setOriginalData] = useState<DispatchOrder | null>(null);

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
        setOriginalData(found);
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

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: DispatchOrderFormData) => {
      console.warn('Updating dispatch order:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật lệnh điều động thành công! (Mock)');
      if (id) {
        navigate(DISPATCH_ORDER_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(DISPATCH_ORDER_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa lệnh điều động">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa lệnh điều động">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(DISPATCH_ORDER_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={dispatchOrderSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.orderCode || ''}`}
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <DispatchOrderForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default DispatchOrderEditPage;
