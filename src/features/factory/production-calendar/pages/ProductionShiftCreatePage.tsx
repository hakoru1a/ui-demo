// ==============================|| PRODUCTION SHIFT CREATE PAGE ||============================== //

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import ProductionShiftForm from '../components/ProductionShiftForm';
import type { ProductionShiftFormData } from '../types';
import { PRODUCTION_CALENDAR_URLS } from '../types/constants';
import { productionShiftSchema, productionShiftDefaultValues } from '../validation';

// ==============================|| PRODUCTION SHIFT CREATE PAGE ||============================== //

const ProductionShiftCreatePage = () => {
  const navigate = useNavigate();

  // Initial form values - set default endTime to 8 hours after startTime
  const initialValues: ProductionShiftFormData = {
    ...productionShiftDefaultValues,
    startTime: new Date(),
    endTime: dateHelper.from(new Date()).add(8, 'hour').toDate()
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: ProductionShiftFormData) => {
      // TODO: Call API to create shift
      console.warn('Creating shift:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Generate a new ID and navigate to detail page
      const mockNewId = `shift-${Date.now()}`;
      alert('Tạo ca sản xuất thành công! (Mock)');
      navigate(PRODUCTION_CALENDAR_URLS.DETAIL(mockNewId));
    },
    [navigate]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate(PRODUCTION_CALENDAR_URLS.LIST);
  }, [navigate]);

  return (
    <Formik initialValues={initialValues} validationSchema={productionShiftSchema} onSubmit={handleSubmit} validateOnChange validateOnBlur>
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Tạo ca sản xuất mới"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại lịch
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <ProductionShiftForm mode="create" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default ProductionShiftCreatePage;
