import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import VehicleForm from '../components/VehicleForm';
import type { VehicleFormData } from '../types';
import { FLEET_URLS } from '../types/constants';
import { vehicleSchema, vehicleDefaultValues } from '../validation';

// ==============================|| VEHICLE CREATE PAGE ||============================== //

const VehicleCreatePage = () => {
  const navigate = useNavigate();

  // Initial form values
  const initialValues: VehicleFormData = {
    ...vehicleDefaultValues
  };

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: VehicleFormData) => {
      // Mock API call - simulate network delay
      console.warn('Creating vehicle:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Generate a new ID and navigate to detail page
      const mockNewId = `mock-${Date.now()}`;
      alert('Tạo xe & tài xế thành công! (Mock)');
      navigate(FLEET_URLS.DETAIL(mockNewId));
    },
    [navigate]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate(FLEET_URLS.LIST);
  }, [navigate]);

  return (
    <Formik initialValues={initialValues} validationSchema={vehicleSchema} onSubmit={handleSubmit} validateOnChange validateOnBlur>
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Thêm xe & tài xế"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại danh sách
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <VehicleForm mode="create" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default VehicleCreatePage;
