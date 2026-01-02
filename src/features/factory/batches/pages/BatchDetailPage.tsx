// ==============================|| BATCH DETAIL PAGE ||============================== //

import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import BatchForm from '../components/BatchForm';
import { getMockBatchById } from '../mock/batches';
import type { BatchFormData, Batch } from '../types';
import { BATCH_URLS, BATCH_STATUS_OPTIONS } from '../types/constants';
import { batchDefaultValues } from '../validation';

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

const getLabelFromOptions = <T extends string>(value: T, options: { value: T; label: string }[]): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

// ==============================|| BATCH DETAIL PAGE ||============================== //

const BatchDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Batch | null>(null);
  const [initialValues, setInitialValues] = useState<BatchFormData>(batchDefaultValues);

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
        setData(found);
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

  // Handle edit navigation
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(BATCH_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(BATCH_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết lô sản xuất">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết lô sản xuất">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}} // No submit for view mode
      enableReinitialize
    >
      <Form>
        <MainCard
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <span>{data?.code}</span>
              <Chip
                label={getLabelFromOptions(data?.status || 'in-progress', BATCH_STATUS_OPTIONS)}
                color={data?.status === 'completed' ? 'success' : data?.status === 'in-progress' ? 'info' : 'error'}
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại danh sách
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <BatchForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default BatchDetailPage;
