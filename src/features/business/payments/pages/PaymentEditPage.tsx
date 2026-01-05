import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import PaymentOrderForm from '../components/PaymentOrderForm';
import type { PaymentOrder, PaymentOrderFormData } from '../types';
import { PAYMENT_ORDER_URLS } from '../types/constants';
import { paymentOrderDefaultValues, paymentOrderSchema } from '../validation';

// Mock data - TODO: Replace with API call
const getMockPaymentOrder = (id: string): PaymentOrder | null => {
  const mockPaymentOrders: PaymentOrder[] = [
    {
      id: '1',
      code: 'PO001',
      type: 'payment',
      partnerType: 'customer',
      partnerId: '1',
      partnerName: 'Khách hàng A',
      contractId: '1',
      contractCode: 'HD001',
      paymentAmount: 50000000,
      currency: 'VND',
      paymentMethod: 'transfer',
      paymentDate: new Date('2024-01-15'),
      description: 'Thanh toán hợp đồng HD001',
      status: 'draft',
      createdAt: new Date('2024-01-10')
    }
  ];
  return mockPaymentOrders.find((po) => po.id === id) || null;
};

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: PaymentOrder): PaymentOrderFormData => ({
  code: entity.code,
  type: entity.type,
  partnerType: entity.partnerType,
  partnerId: entity.partnerId,
  contractId: entity.contractId,
  paymentAmount: entity.paymentAmount,
  currency: entity.currency,
  paymentMethod: entity.paymentMethod,
  paymentDate: entity.paymentDate,
  description: entity.description,
  attachment: entity.attachment,
  status: entity.status
});

// ==============================|| PAYMENT ORDER EDIT PAGE ||============================== //

const PaymentEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<PaymentOrderFormData>(paymentOrderDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockPaymentOrder(id);

        if (found) {
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy phiếu chi');
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
    async (values: PaymentOrderFormData) => {
      // Mock API call - simulate network delay
      console.warn('Updating payment order:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật phiếu chi thành công! (Mock)');
      if (id) {
        navigate(PAYMENT_ORDER_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(PAYMENT_ORDER_URLS.DETAIL(id));
    } else {
      navigate(PAYMENT_ORDER_URLS.LIST);
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa phiếu chi">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa phiếu chi">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(PAYMENT_ORDER_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={paymentOrderSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa phiếu chi"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu PO'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <PaymentOrderForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentEditPage;
