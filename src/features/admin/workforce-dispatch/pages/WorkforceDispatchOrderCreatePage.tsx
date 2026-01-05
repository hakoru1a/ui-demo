import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import WorkforceDispatchOrderForm from '../components/WorkforceDispatchOrderForm';
import type { WorkforceDispatchOrderFormData } from '../types';
import { WORKFORCE_DISPATCH_URLS } from '../types/constants';
import { workforceDispatchOrderDefaultValues, workforceDispatchOrderSchema } from '../validation';

// ==============================|| WORKFORCE DISPATCH ORDER CREATE PAGE ||============================== //

const WorkforceDispatchOrderCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: WorkforceDispatchOrderFormData) => {
      setIsSubmitting(true);
      setError(null);

      try {
        // TODO: Call API to create order
        // await workforceDispatchOrderService.createWorkforceDispatchOrder(values);

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navigate to list page after success
        navigate(WORKFORCE_DISPATCH_URLS.LIST);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo lệnh điều phối');
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(WORKFORCE_DISPATCH_URLS.LIST);
  }, [navigate]);

  return (
    <MainCard
      title="Thêm lệnh điều phối mới"
      secondary={
        <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại
        </Button>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik initialValues={workforceDispatchOrderDefaultValues} validationSchema={workforceDispatchOrderSchema} onSubmit={handleSubmit}>
        {({ handleSubmit: formikSubmit, isSubmitting: formikIsSubmitting }) => (
          <Form>
            <WorkforceDispatchOrderForm mode="create" />
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={handleBack} disabled={isSubmitting || formikIsSubmitting}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  formikSubmit();
                }}
                disabled={isSubmitting || formikIsSubmitting}
              >
                {isSubmitting || formikIsSubmitting ? 'Đang lưu...' : 'Lưu nháp'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
};

export default WorkforceDispatchOrderCreatePage;
