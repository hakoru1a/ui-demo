import { SaveOutlined } from '@ant-design/icons';
import { Box, Button, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import HarvestOrderForm from '../components/HarvestOrderForm';
import { HARVEST_ORDER_URLS } from '../types/constants';
import type { HarvestOrderFormData } from '../types/index';
import { harvestOrderDefaultValues, harvestOrderSchema } from '../validation';

// ==============================|| HARVEST ORDER CREATE PAGE ||============================== //

const HarvestOrderCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmittingMock, setIsSubmittingMock] = useState(false);

  const handleSubmit = useCallback(
    async (values: HarvestOrderFormData) => {
      setIsSubmittingMock(true);
      try {
        console.warn('Creating harvest order:', values);
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        alert('Tạo lệnh khai thác thành công! (Mock)');
        navigate(HARVEST_ORDER_URLS.LIST);
      } catch (error) {
        console.error('Error creating harvest order:', error);
        alert('Có lỗi xảy ra khi tạo lệnh khai thác');
      } finally {
        setIsSubmittingMock(false);
      }
    },
    [navigate]
  );

  const handleCancel = useCallback(() => {
    navigate(HARVEST_ORDER_URLS.LIST);
  }, [navigate]);

  return (
    <Formik
      initialValues={harvestOrderDefaultValues}
      validationSchema={harvestOrderSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ isSubmitting, handleSubmit: formikSubmit }) => (
        <Form onSubmit={formikSubmit}>
          <MainCard
            title="Tạo lệnh khai thác mới"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={isSubmitting || isSubmittingMock}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveOutlined />}
                  disabled={isSubmitting || isSubmittingMock}
                >
                  {isSubmitting || isSubmittingMock ? 'Đang lưu...' : 'Lưu lại'}
                </Button>
              </Stack>
            }
          >
            <Box sx={{ p: 1 }}>
              <HarvestOrderForm mode="create" />
            </Box>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default HarvestOrderCreatePage;
