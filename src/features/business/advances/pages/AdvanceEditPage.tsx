import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import advanceService from '../api/index';
import AdvanceForm from '../components/AdvanceForm';
import { getMockAdvance } from '../mock/mock';
import type { Advance, AdvanceFormData } from '../types';
import { ADVANCE_URLS } from '../types/constants';
import { advanceDefaultValues, advanceSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Advance): AdvanceFormData => ({
  code: entity.code,
  requesterId: entity.requesterId,
  requestedDate: entity.requestedDate,
  requestedAmount: entity.requestedAmount,
  purpose: entity.purpose,
  status: entity.status
});

// ==============================|| ADVANCE EDIT PAGE ||============================== //

const AdvanceEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<AdvanceFormData>(advanceDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        // TODO: Replace with API call
        const found = getMockAdvance(id);

        if (found) {
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy phiếu tạm ứng');
        }
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: AdvanceFormData) => {
      if (!id) return;

      // TODO: Replace with API call
      console.warn('Updating advance:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Call API
      try {
        const response = await advanceService.updateAdvance(id, values);
        if (response.success) {
          // Navigate to detail page
          navigate(ADVANCE_URLS.DETAIL(id));
        }
      } catch (err) {
        console.error('Error updating advance:', err);
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(ADVANCE_URLS.DETAIL(id));
    } else {
      navigate(ADVANCE_URLS.LIST);
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa phiếu tạm ứng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa phiếu tạm ứng">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(ADVANCE_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={advanceSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa phiếu tạm ứng"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <AdvanceForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default AdvanceEditPage;
