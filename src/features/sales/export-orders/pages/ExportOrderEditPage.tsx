import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ExportOrderForm from '../components/ExportOrderForm';
import type { ExportOrder, ExportOrderFormData } from '../types';
import { EXPORT_ORDER_URLS } from '../types/constants';
import { exportOrderSchema, exportOrderDefaultValues } from '../validation';

// Mock function to get order by ID - TODO: Replace with API call
const getMockOrderById = (id: string): ExportOrder | null => {
  const mockOrders: ExportOrder[] = [
    {
      id: '1',
      orderNo: 'XK001',
      orderDate: new Date('2024-01-15'),
      customerId: 'customer-001',
      customerName: 'Công ty ABC International',
      country: 'US',
      totalValue: 50000,
      currency: 'USD',
      incoterms: 'FOB',
      status: 'confirmed'
    }
  ];
  return mockOrders.find((o) => o.id === id) || null;
};

// ==============================|| EXPORT ORDER EDIT PAGE ||============================== //

const ExportOrderEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<ExportOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load order data
  useEffect(() => {
    if (id) {
      // Mock API call
      const mockOrder = getMockOrderById(id);
      setOrder(mockOrder);
      setIsLoading(false);
    }
  }, [id]);

  // Convert entity to form data
  const entityToFormData = (entity: ExportOrder): ExportOrderFormData => {
    return {
      orderNo: entity.orderNo,
      orderDate: entity.orderDate,
      customerId: entity.customerId,
      country: entity.country,
      totalValue: entity.totalValue,
      currency: entity.currency,
      incoterms: entity.incoterms,
      status: entity.status
    };
  };

  // Initial form values
  const initialValues: ExportOrderFormData = order ? entityToFormData(order) : exportOrderDefaultValues;

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: ExportOrderFormData) => {
      if (!id) return;

      // Mock API call - simulate network delay
      console.warn('Updating export order:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật đơn hàng xuất khẩu thành công! (Mock)');
      navigate(EXPORT_ORDER_URLS.DETAIL(id));
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(EXPORT_ORDER_URLS.DETAIL(id));
    } else {
      navigate(EXPORT_ORDER_URLS.LIST);
    }
  }, [navigate, id]);

  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa đơn hàng xuất khẩu">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!order) {
    return (
      <MainCard title="Chỉnh sửa đơn hàng xuất khẩu">
        <div>Không tìm thấy đơn hàng xuất khẩu</div>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={exportOrderSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa đơn hàng xuất khẩu"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <ExportOrderForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default ExportOrderEditPage;
