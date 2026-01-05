import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import TrainingForm from '../components/TrainingForm';
import { getMockTraining } from '../mock/trainings';
import type { Training, TrainingFormData } from '../types';
import { TRAINING_URLS } from '../types/constants';
import { trainingDefaultValues, trainingSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Training): TrainingFormData => ({
  name: entity.name,
  type: entity.type,
  department: entity.department,
  startDate: entity.startDate,
  endDate: entity.endDate,
  participantCount: entity.participantCount,
  status: entity.status
});

// ==============================|| TRAINING EDIT PAGE ||============================== //

const TrainingEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Training | null>(null);
  const [initialValues, setInitialValues] = useState<TrainingFormData>(trainingDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockTraining(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy khóa đào tạo');
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
    async (values: TrainingFormData) => {
      if (!id) return;

      setIsSubmitting(true);
      setError(null);

      try {
        // TODO: Call API to update training
        // await trainingService.updateTraining(id, values);

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navigate to detail page after success
        navigate(TRAINING_URLS.DETAIL(id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật khóa đào tạo');
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, id]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (id) {
      navigate(TRAINING_URLS.DETAIL(id));
    } else {
      navigate(TRAINING_URLS.LIST);
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
          <div>{error || 'Không tìm thấy khóa đào tạo'}</div>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Chỉnh sửa khóa đào tạo"
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

      <Formik initialValues={initialValues} validationSchema={trainingSchema} enableReinitialize onSubmit={handleSubmit}>
        {({ handleSubmit: formikSubmit, isSubmitting: formikIsSubmitting }) => (
          <Form>
            <TrainingForm mode="edit" />
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

export default TrainingEditPage;
