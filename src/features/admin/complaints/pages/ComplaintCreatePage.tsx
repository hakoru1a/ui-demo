import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ComplaintForm from '../components/ComplaintForm';
import { COMPLAINT_URLS } from '../types/constants';
import type { ComplaintFormData } from '../types/index';
import { complaintDefaultValues, complaintSchema } from '../validation';

// ==============================|| COMPLAINT CREATE PAGE ||============================== //

const ComplaintCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: ComplaintFormData) => {
      setIsSubmitting(true);
      setError(null);

      try {
        // TODO: Call API to create complaint
        // await complaintService.createComplaint(values);

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navigate to list page after success
        navigate(COMPLAINT_URLS.LIST);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo khiếu nại');
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(COMPLAINT_URLS.LIST);
  }, [navigate]);

  return (
    <MainCard
      title="Tạo khiếu nại mới"
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

      <Formik initialValues={complaintDefaultValues} validationSchema={complaintSchema} onSubmit={handleSubmit}>
        {({ handleSubmit: formikSubmit, isSubmitting: formikIsSubmitting }) => (
          <Form>
            <ComplaintForm mode="create" />
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
                {isSubmitting || formikIsSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
};

export default ComplaintCreatePage;
