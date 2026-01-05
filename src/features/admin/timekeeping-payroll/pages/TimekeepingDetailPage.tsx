// ==============================|| TIMEKEEPING DETAIL PAGE ||============================== //

import { EditOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Button, Grid, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import TimekeepingForm from '../components/TimekeepingForm';
import { mockShifts } from '../mock/shifts';
import type { WorkShift, WorkShiftFormData } from '../types/index';
import { TIMEKEEPING_URLS } from '../types/index';
import { workShiftDefaultValues, workShiftSchema } from '../validation/index';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: WorkShift): WorkShiftFormData => ({
  employeeId: entity.employeeId,
  employeeCode: entity.employeeCode,
  employeeName: entity.employeeName,
  shiftType: entity.shiftType,
  workDate: entity.workDate,
  startTime: entity.startTime,
  endTime: entity.endTime,
  status: entity.status,
  notes: entity.notes || ''
});

// ==============================|| TIMEKEEPING DETAIL PAGE ||============================== //

const TimekeepingDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WorkShift | null>(null);
  const [initialValues, setInitialValues] = useState<WorkShiftFormData>(workShiftDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = mockShifts.find((shift) => shift.id === id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy chấm công');
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
    async (values: WorkShiftFormData) => {
      if (!id) return;

      setIsSubmitting(true);
      setError(null);

      try {
        // Mock API call
        console.warn('Update timekeeping:', id, values);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert(`Cập nhật chấm công thành công (Mock)`);
        setMode('view');
        // Refresh data
        const found = mockShifts.find((shift) => shift.id === id);
        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật chấm công');
      } finally {
        setIsSubmitting(false);
      }
    },
    [id]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(TIMEKEEPING_URLS.LIST);
  }, [navigate]);

  // Handle edit mode
  const handleEdit = useCallback(() => {
    setMode('edit');
  }, []);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    if (data) {
      setInitialValues(entityToFormData(data));
    }
    setMode('view');
  }, [data]);

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
          <Alert severity="error">{error || 'Không tìm thấy chấm công'}</Alert>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={workShiftSchema}
      enableReinitialize
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting: formikIsSubmitting, dirty }) => (
        <Form>
          <MainCard
            title={mode === 'view' ? 'Chi tiết chấm công' : 'Chỉnh sửa chấm công'}
            secondary={
              <Stack direction="row" spacing={1}>
                {mode === 'view' ? (
                  <>
                    <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                      Quay lại
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                      Chỉnh sửa
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outlined" color="secondary" onClick={handleCancelEdit} disabled={isSubmitting || formikIsSubmitting}>
                      Hủy
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
                  </>
                )}
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
                <TimekeepingForm mode={mode} />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default TimekeepingDetailPage;
