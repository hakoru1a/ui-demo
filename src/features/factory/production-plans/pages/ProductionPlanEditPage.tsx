// ==============================|| PRODUCTION PLAN EDIT PAGE ||============================== //

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ProductionPlanForm from '../components/ProductionPlanForm';
import { mockProductionPlans } from '../mock/productionPlans';
import type { ProductionPlanFormData, ProductionPlan } from '../types';
import { PRODUCTION_PLAN_URLS } from '../types/constants';
import { productionPlanSchema, productionPlanDefaultValues } from '../validation';

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

// ==============================|| PRODUCTION PLAN EDIT PAGE ||============================== //

const ProductionPlanEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<ProductionPlanFormData>(productionPlanDefaultValues);
  const [originalData, setOriginalData] = useState<ProductionPlan | null>(null);

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
        setOriginalData(found);
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

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: ProductionPlanFormData) => {
      // TODO: Call API to update production plan
      console.warn('Updating production plan:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật kế hoạch/lệnh sản xuất thành công! (Mock)');
      if (id) {
        navigate(PRODUCTION_PLAN_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(PRODUCTION_PLAN_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa kế hoạch / lệnh sản xuất">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa kế hoạch / lệnh sản xuất">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(PRODUCTION_PLAN_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={productionPlanSchema}
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
                <ProductionPlanForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default ProductionPlanEditPage;
