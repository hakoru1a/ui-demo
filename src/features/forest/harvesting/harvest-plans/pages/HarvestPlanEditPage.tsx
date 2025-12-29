import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import HarvestPlanForm from '../components/HarvestPlanForm';
import { mockHarvestPlans } from '../mock/harvestPlans';
import type { HarvestPlanFormData, HarvestPlan } from '../types';
import { HARVEST_PLAN_URLS } from '../types/constants';
import { harvestPlanSchema, harvestPlanDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: HarvestPlan): HarvestPlanFormData => ({
  code: entity.code,
  name: entity.name,
  forestAreaId: entity.forestAreaId,
  area: entity.area,
  startDate: entity.startDate,
  endDate: entity.endDate,
  expectedYield: entity.expectedYield,
  fscStandard: entity.fscStandard,
  description: entity.description,
  status: entity.status
});

// ==============================|| HARVEST PLAN EDIT PAGE ||============================== //

const HarvestPlanEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<HarvestPlanFormData>(harvestPlanDefaultValues);
  const [originalData, setOriginalData] = useState<HarvestPlan | null>(null);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = mockHarvestPlans.find((item) => item.id === id);

      if (found) {
        setOriginalData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy vùng trồng');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: HarvestPlanFormData) => {
      console.warn('Updating harvest plan:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật vùng trồng thành công! (Mock)');
      if (id) {
        navigate(HARVEST_PLAN_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(HARVEST_PLAN_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa vùng trồng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa vùng trồng">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(HARVEST_PLAN_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={harvestPlanSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty, values }) => (
        <Form>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.name || ''}`}
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
                <HarvestPlanForm mode="edit" isApproved={!!originalData?.approvedAt} />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default HarvestPlanEditPage;
