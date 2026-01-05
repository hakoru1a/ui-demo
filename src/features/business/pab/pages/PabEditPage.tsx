// ==============================|| PAB EDIT PAGE ||============================== //

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import SendOutlined from '@ant-design/icons/SendOutlined';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import PabForm from '../components/PabForm';
import { getMockPabs } from '../mock/pabs';
import { PAB_URLS } from '../types/constants';
import type { PabFormData, Pab } from '../types/index';
import { pabSchema, pabDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Pab): PabFormData => ({
  code: entity.code,
  customerId: entity.customerId,
  productId: entity.productId,
  quantity: entity.quantity,
  unit: entity.unit,
  expectedDeliveryDate: entity.expectedDeliveryDate,
  estimatedCost: entity.estimatedCost,
  estimatedTime: entity.estimatedTime,
  margin: entity.margin,
  notes: entity.notes,
  status: entity.status
});

// ==============================|| PAB EDIT PAGE ||============================== //

const PabEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<PabFormData>(pabDefaultValues);
  const [originalData, setOriginalData] = useState<Pab | null>(null);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = getMockPabs().find((item) => item.id === id);

      if (found) {
        setOriginalData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy PAB');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: PabFormData) => {
      console.warn('Updating PAB:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật PAB thành công! (Mock)');
      if (id) {
        navigate(PAB_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle submit for approval
  const handleSubmitForApproval = useCallback(
    async (values: PabFormData) => {
      console.warn('Submitting PAB for approval:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update status to pending-approval and navigate to approval page
      if (id) {
        navigate(PAB_URLS.APPROVAL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(PAB_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa PAB">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa PAB">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(PAB_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={pabSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty, values }) => (
        <Form>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.code || ''}`}
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                {values.status === 'draft' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SendOutlined />}
                    onClick={() => handleSubmitForApproval(values)}
                    disabled={isSubmitting || !dirty}
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi phê duyệt'}
                  </Button>
                )}
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu PAB'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <PabForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default PabEditPage;
