import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import VehicleForm from '../components/VehicleForm';
import { mockVehicles } from '../mock/vehicles';
import type { VehicleFormData, Vehicle } from '../types';
import { FLEET_URLS } from '../types/constants';
import { vehicleDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Vehicle): VehicleFormData => ({
  licensePlate: entity.licensePlate,
  vehicleType: entity.vehicleType,
  maxLoad: entity.maxLoad,
  driverName: entity.driverName,
  driverPhone: entity.driverPhone,
  driverLicenseNumber: entity.driverLicenseNumber,
  driverLicenseExpiry: entity.driverLicenseExpiry,
  vehicleStatus: entity.vehicleStatus,
  driverStatus: entity.driverStatus,
  notes: entity.notes
});

// ==============================|| VEHICLE DETAIL PAGE ||============================== //

const VehicleDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Vehicle | null>(null);
  const [initialValues, setInitialValues] = useState<VehicleFormData>(vehicleDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = mockVehicles.find((item) => item.id === id);

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy xe');
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
      navigate(FLEET_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(FLEET_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết xe & tài xế">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết xe & tài xế">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

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
              <span>{data?.licensePlate}</span>
              <Chip
                label={data?.vehicleStatus === 'ready' ? 'Sẵn sàng' : data?.vehicleStatus === 'running' ? 'Đang chạy' : 'Bảo trì'}
                color={data?.vehicleStatus === 'ready' ? 'success' : data?.vehicleStatus === 'running' ? 'info' : 'warning'}
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại danh sách
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <VehicleForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default VehicleDetailPage;
