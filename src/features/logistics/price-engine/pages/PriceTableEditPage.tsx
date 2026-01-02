import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import PriceTableForm from '../components/PriceTableForm';
import { getMockPriceTableById } from '../mock/priceTables';
import type { PriceTableFormData, PriceTable } from '../types';
import { PRICE_TABLE_URLS } from '../types/constants';
import { priceTableSchema, priceTableDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: PriceTable): PriceTableFormData => ({
  code: entity.code,
  name: entity.name,
  materialType: entity.materialType,
  basePrice: entity.basePrice,
  adjustmentFormula: entity.adjustmentFormula,
  effectiveFrom: entity.effectiveFrom,
  status: entity.status
});

// ==============================|| PRICE TABLE EDIT PAGE ||============================== //

const PriceTableEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<PriceTableFormData>(priceTableDefaultValues);
  const [originalData, setOriginalData] = useState<PriceTable | null>(null);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = id ? getMockPriceTableById(id) : undefined;

      if (found) {
        setOriginalData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy bảng giá');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: PriceTableFormData) => {
      console.warn('Updating price table:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật bảng giá thành công! (Mock)');
      if (id) {
        navigate(PRICE_TABLE_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(PRICE_TABLE_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa bảng giá">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa bảng giá">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(PRICE_TABLE_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={priceTableSchema}
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
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu bảng giá'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <PriceTableForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default PriceTableEditPage;
