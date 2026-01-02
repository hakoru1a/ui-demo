// ==============================|| PRODUCTION SHIFT EDIT PAGE ||============================== //

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ProductionShiftForm from '../components/ProductionShiftForm';
import { getMockShiftById } from '../mock/shifts';
import type { ProductionShiftFormData, ProductionShift } from '../types';
import { PRODUCTION_CALENDAR_URLS } from '../types/constants';
import { productionShiftSchema, productionShiftDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: ProductionShift): ProductionShiftFormData => ({
  batchId: entity.batchId,
  productionLineId: entity.productionLineId,
  startTime: entity.startTime,
  endTime: entity.endTime,
  status: entity.status,
  notes: entity.notes || ''
});

// ==============================|| PRODUCTION SHIFT EDIT PAGE ||============================== //

const ProductionShiftEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<ProductionShiftFormData>(productionShiftDefaultValues);
  const [originalData, setOriginalData] = useState<ProductionShift | null>(null);

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
        setOriginalData(found);
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

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: ProductionShiftFormData) => {
      // TODO: Call API to update shift
      console.warn('Updating shift:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật ca sản xuất thành công! (Mock)');
      if (id) {
        navigate(PRODUCTION_CALENDAR_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(PRODUCTION_CALENDAR_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa ca sản xuất">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa ca sản xuất">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(PRODUCTION_CALENDAR_URLS.LIST)}>
          Quay lại lịch
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={productionShiftSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.batchCode || ''} - ${originalData?.productionLineName || ''}`}
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
                <ProductionShiftForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default ProductionShiftEditPage;
