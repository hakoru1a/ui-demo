// ==============================|| PRODUCTION SHIFT DETAIL PAGE ||============================== //

import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ProductionShiftForm from '../components/ProductionShiftForm';
import { getMockShiftById } from '../mock/shifts';
import type { ProductionShiftFormData, ProductionShift } from '../types';
import { PRODUCTION_CALENDAR_URLS, SHIFT_STATUS_OPTIONS } from '../types/constants';
import { productionShiftDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: ProductionShift): ProductionShiftFormData => ({
  batchId: entity.batchId,
  productionLineId: entity.productionLineId,
  startTime: entity.startTime,
  endTime: entity.endTime,
  status: entity.status,
  notes: entity.notes || ''
});

const getLabelFromOptions = <T extends string>(value: T, options: { value: T; label: string }[]): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

// ==============================|| PRODUCTION SHIFT DETAIL PAGE ||============================== //

const ProductionShiftDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductionShift | null>(null);
  const [initialValues, setInitialValues] = useState<ProductionShiftFormData>(productionShiftDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = id ? getMockShiftById(id) : undefined;

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy ca sản xuất');
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
      navigate(PRODUCTION_CALENDAR_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(PRODUCTION_CALENDAR_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết ca sản xuất">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết ca sản xuất">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại lịch
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}} enableReinitialize>
      <Form>
        <MainCard
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <span>
                {data?.batchCode} - {data?.productionLineName}
              </span>
              <Chip
                label={getLabelFromOptions(data?.status || 'scheduled', SHIFT_STATUS_OPTIONS)}
                color={
                  data?.status === 'completed'
                    ? 'success'
                    : data?.status === 'in-progress'
                      ? 'info'
                      : data?.status === 'cancelled'
                        ? 'error'
                        : 'default'
                }
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại lịch
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <ProductionShiftForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default ProductionShiftDetailPage;
