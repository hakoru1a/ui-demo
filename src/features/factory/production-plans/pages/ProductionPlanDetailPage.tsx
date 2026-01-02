// ==============================|| PRODUCTION PLAN DETAIL PAGE ||============================== //

import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ProductionPlanForm from '../components/ProductionPlanForm';
import { mockProductionPlans } from '../mock/productionPlans';
import type { ProductionPlanFormData, ProductionPlan } from '../types';
import { PRODUCTION_PLAN_URLS, PLAN_TYPE_OPTIONS, PLAN_STATUS_OPTIONS } from '../types/constants';
import { productionPlanDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: ProductionPlan): ProductionPlanFormData => ({
  code: entity.code,
  type: entity.type,
  productId: entity.productId,
  plannedQuantity: entity.plannedQuantity,
  startDate: entity.startDate,
  endDate: entity.endDate,
  estimatedCost: entity.estimatedCost,
  productionLineId: entity.productionLineId,
  status: entity.status,
  notes: entity.notes
});

const getLabelFromOptions = <T extends string>(value: T, options: { value: T; label: string }[]): string => {
  return options.find((opt) => opt.value === value)?.label || value;
};

// ==============================|| PRODUCTION PLAN DETAIL PAGE ||============================== //

const ProductionPlanDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductionPlan | null>(null);
  const [initialValues, setInitialValues] = useState<ProductionPlanFormData>(productionPlanDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = mockProductionPlans.find((item) => item.id === id);

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy kế hoạch/lệnh sản xuất');
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
      navigate(PRODUCTION_PLAN_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(PRODUCTION_PLAN_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết kế hoạch / lệnh sản xuất">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết kế hoạch / lệnh sản xuất">
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
                label={getLabelFromOptions(data?.type || 'plan', PLAN_TYPE_OPTIONS)}
                color={data?.type === 'plan' ? 'primary' : 'secondary'}
                size="small"
              />
              <Chip
                label={getLabelFromOptions(data?.status || 'draft', PLAN_STATUS_OPTIONS)}
                color={data?.status === 'completed' ? 'success' : data?.status === 'in-progress' ? 'info' : 'warning'}
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
              <ProductionPlanForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default ProductionPlanDetailPage;
