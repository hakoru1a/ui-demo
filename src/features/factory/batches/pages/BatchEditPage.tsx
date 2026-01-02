// ==============================|| BATCH EDIT PAGE ||============================== //

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import BatchForm from '../components/BatchForm';
import { getMockBatchById } from '../mock/batches';
import type { BatchFormData, Batch } from '../types';
import { BATCH_URLS } from '../types/constants';
import { batchSchema, batchDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Batch): BatchFormData => ({
  code: entity.code,
  productionOrderId: entity.productionOrderId,
  productId: entity.productId,
  plannedQuantity: entity.plannedQuantity,
  actualQuantity: entity.actualQuantity,
  startDate: entity.startDate,
  endDate: entity.endDate,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| BATCH EDIT PAGE ||============================== //

const BatchEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<BatchFormData>(batchDefaultValues);
  const [originalData, setOriginalData] = useState<Batch | null>(null);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = id ? getMockBatchById(id) : undefined;

      if (found) {
        setOriginalData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy lô sản xuất');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: BatchFormData) => {
      // TODO: Call API to update batch
      console.warn('Updating batch:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật lô sản xuất thành công! (Mock)');
      if (id) {
        navigate(BATCH_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(BATCH_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa lô sản xuất">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa lô sản xuất">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(BATCH_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={batchSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.code || ''}`}
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <BatchForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default BatchEditPage;
