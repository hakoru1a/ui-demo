import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import ComplaintForm from '../components/ComplaintForm';
import { getMockComplaint } from '../mock/complaints';
import type { Complaint, ComplaintFormData } from '../types';
import { COMPLAINT_URLS } from '../types/constants';
import { complaintDefaultValues, complaintSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Complaint): ComplaintFormData => ({
  code: entity.code,
  sender: entity.sender,
  relatedEmployeeId: entity.relatedEmployeeId,
  type: entity.type,
  receivedDate: entity.receivedDate,
  status: entity.status,
  description: entity.description,
  resolution: entity.resolution
});

// ==============================|| COMPLAINT EDIT PAGE ||============================== //

const ComplaintEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Complaint | null>(null);
  const [initialValues, setInitialValues] = useState<ComplaintFormData>(complaintDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockComplaint(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy khiếu nại');
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
    async (values: ComplaintFormData) => {
      if (!id) return;

      setIsSubmitting(true);
      setError(null);

      try {
        // TODO: Call API to update complaint
        // await complaintService.updateComplaint(id, values);

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navigate to detail page after success
        navigate(COMPLAINT_URLS.DETAIL(id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật khiếu nại');
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, id]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (id) {
      navigate(COMPLAINT_URLS.DETAIL(id));
    } else {
      navigate(COMPLAINT_URLS.LIST);
    }
  }, [navigate, id]);

  if (isLoading) {
    return (
      <MainCard>
        <CircularLoader />
      </MainCard>
    );
  }

  if (error || !data) {
    return (
      <MainCard>
        <Stack spacing={2}>
          <div>{error || 'Không tìm thấy khiếu nại'}</div>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Chỉnh sửa khiếu nại"
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

      <Formik initialValues={initialValues} validationSchema={complaintSchema} enableReinitialize onSubmit={handleSubmit}>
        {({ handleSubmit: formikSubmit, isSubmitting: formikIsSubmitting }) => (
          <Form>
            <ComplaintForm mode="edit" />
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

export default ComplaintEditPage;
