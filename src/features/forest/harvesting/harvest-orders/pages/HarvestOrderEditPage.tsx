import { SaveOutlined } from '@ant-design/icons';
import { Box, Button, CircularProgress, Stack, Alert } from '@mui/material';
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import HarvestOrderForm from '../components/HarvestOrderForm';
import { mockHarvestOrders } from '../mock/harvestOrders';
import { HARVEST_ORDER_URLS } from '../types/constants';
import type { HarvestOrder, HarvestOrderFormData } from '../types/index';
import { harvestOrderSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: HarvestOrder): HarvestOrderFormData => ({
  code: entity.code,
  planId: entity.planId,
  forestAreaId: entity.forestAreaId,
  startDate: entity.startDate,
  actualYield: entity.actualYield,
  executorType: entity.executorType || '',
  note: entity.note || '',
  status: entity.status
});

// ==============================|| HARVEST ORDER EDIT PAGE ||============================== //

const HarvestOrderEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<HarvestOrderFormData | null>(null);
  const [originalData, setOriginalData] = useState<HarvestOrder | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const found = mockHarvestOrders.find((item) => item.id === id);

      if (found) {
        setOriginalData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy lệnh khai thác');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = useCallback(
    async (values: HarvestOrderFormData) => {
      try {
        console.warn('Updating harvest order:', values);
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        alert('Cập nhật lệnh khai thác thành công! (Mock)');
        if (id) {
          navigate(HARVEST_ORDER_URLS.DETAIL(id));
        }
      } catch (err) {
        console.error('Error updating harvest order:', err);
        alert('Có lỗi xảy ra khi cập nhật lệnh khai thác');
      }
    },
    [navigate, id]
  );

  const handleCancel = useCallback(() => {
    if (id) {
      navigate(HARVEST_ORDER_URLS.DETAIL(id));
    } else {
      navigate(HARVEST_ORDER_URLS.LIST);
    }
  }, [navigate, id]);

  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa lệnh khai thác">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (error || !initialValues) {
    return (
      <MainCard title="Chỉnh sửa lệnh khai thác">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Lỗi không xác định'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(HARVEST_ORDER_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={harvestOrderSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ isSubmitting, dirty, handleSubmit: formikSubmit }) => (
        <Form onSubmit={formikSubmit}>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.code || ''}`}
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Stack>
            }
          >
            <Box sx={{ p: 1 }}>
              <HarvestOrderForm mode="edit" />
            </Box>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default HarvestOrderEditPage;
