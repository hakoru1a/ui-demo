import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import WorkforceDispatchOrderForm from '../components/WorkforceDispatchOrderForm';
import { getMockWorkforceDispatchOrder } from '../mock/orders';
import type { WorkforceDispatchOrder, WorkforceDispatchOrderFormData } from '../types';
import { WORKFORCE_DISPATCH_URLS } from '../types/constants';
import { workforceDispatchOrderDefaultValues, workforceDispatchOrderSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: WorkforceDispatchOrder): WorkforceDispatchOrderFormData => ({
  code: entity.code,
  applicationDate: entity.applicationDate,
  factoryId: entity.factoryId,
  productionShiftId: entity.productionShiftId,
  departmentId: entity.departmentId,
  personnel: entity.personnel.map((p) => ({
    personnelId: p.personnelId,
    role: p.role,
    note: p.note
  })),
  status: entity.status
});

// ==============================|| WORKFORCE DISPATCH ORDER EDIT PAGE ||============================== //

const WorkforceDispatchOrderEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WorkforceDispatchOrder | null>(null);
  const [initialValues, setInitialValues] = useState<WorkforceDispatchOrderFormData>(workforceDispatchOrderDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockWorkforceDispatchOrder(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy lệnh điều phối');
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
    async (values: WorkforceDispatchOrderFormData) => {
      if (!id) return;

      setIsSubmitting(true);
      setError(null);

      try {
        // TODO: Call API to update order
        // await workforceDispatchOrderService.updateWorkforceDispatchOrder(id, values);

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navigate to detail page after success
        navigate(WORKFORCE_DISPATCH_URLS.DETAIL(id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật lệnh điều phối');
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, id]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (id) {
      navigate(WORKFORCE_DISPATCH_URLS.DETAIL(id));
    } else {
      navigate(WORKFORCE_DISPATCH_URLS.LIST);
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
          <div>{error || 'Không tìm thấy lệnh điều phối'}</div>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Chỉnh sửa lệnh điều phối"
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

      <Formik initialValues={initialValues} validationSchema={workforceDispatchOrderSchema} enableReinitialize onSubmit={handleSubmit}>
        {({ handleSubmit: formikSubmit, isSubmitting: formikIsSubmitting }) => (
          <Form>
            <WorkforceDispatchOrderForm mode="edit" />
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

export default WorkforceDispatchOrderEditPage;
