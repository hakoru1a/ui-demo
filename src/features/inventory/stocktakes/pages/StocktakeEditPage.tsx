import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Alert, Box, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import StocktakeForm from '../components/StocktakeForm';
import { getMockStocktake } from '../mock/mock';
import { entityToFormData } from '../pages/StocktakeDetailPage';
import type { Stocktake, StocktakeFormData } from '../types';
import { STOCKTAKE_URLS } from '../types/constants';
import { stocktakeDefaultValues, stocktakeSchema } from '../validation';

// ==============================|| STOCKTAKE EDIT PAGE ||============================== //

const StocktakeEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setData] = useState<Stocktake | null>(null);
  const [initialValues, setInitialValues] = useState<StocktakeFormData>(stocktakeDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        // TODO: Replace with API call
        const found = getMockStocktake(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy phiếu kiểm kê');
        }
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: StocktakeFormData) => {
      if (!id) return;

      // Mock API call - simulate network delay
      console.warn('Updating Stocktake:', id, values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật phiếu kiểm kê thành công! (Mock)');
      navigate(STOCKTAKE_URLS.DETAIL(id));
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(STOCKTAKE_URLS.DETAIL(id));
    } else {
      navigate(STOCKTAKE_URLS.LIST);
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa phiếu kiểm kê">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa phiếu kiểm kê">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleCancel}>
          Quay lại
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stocktakeSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa phiếu kiểm kê"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu phiếu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <StocktakeForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default StocktakeEditPage;
