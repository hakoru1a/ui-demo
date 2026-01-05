// ==============================|| TIMEKEEPING CREATE PAGE ||============================== //

import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Alert, Button, Grid, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import TimekeepingForm from '../components/TimekeepingForm';
import { TIMEKEEPING_URLS } from '../types/index';
import { workShiftDefaultValues, workShiftSchema } from '../validation/index';

// ==============================|| TIMEKEEPING CREATE PAGE ||============================== //

const TimekeepingCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: typeof workShiftDefaultValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Mock API call
      console.warn('Create timekeeping:', values);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Tạo chấm công thành công cho ${values.employeeName} (Mock)`);
      navigate(TIMEKEEPING_URLS.LIST);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo chấm công');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(TIMEKEEPING_URLS.LIST);
  };

  return (
    <Formik
      initialValues={workShiftDefaultValues}
      validationSchema={workShiftSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting: formikIsSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Thêm chấm công mới"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CloseOutlined />}
                  onClick={handleCancel}
                  disabled={isSubmitting || formikIsSubmitting}
                >
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveOutlined />}
                  disabled={isSubmitting || formikIsSubmitting || !dirty}
                >
                  {isSubmitting || formikIsSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <TimekeepingForm mode="create" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default TimekeepingCreatePage;
