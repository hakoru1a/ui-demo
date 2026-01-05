import { EditOutlined, ArrowLeftOutlined, FilePdfOutlined, SendOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import PaymentOrderForm from '../components/PaymentOrderForm';
import { getMockPaymentOrder } from '../mock/mock';
import type { PaymentOrder, PaymentOrderFormData } from '../types';
import { PAYMENT_ORDER_URLS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';
import { paymentOrderDefaultValues } from '../validation';

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

// ==============================|| PAYMENT ORDER DETAIL PAGE ||============================== //

const PaymentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaymentOrder | null>(null);
  const [initialValues, setInitialValues] = useState<PaymentOrderFormData>(paymentOrderDefaultValues);
  const [isProcessing, setIsProcessing] = useState(false);

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
          setData(found);
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

  // Handle edit navigation
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(PAYMENT_ORDER_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(PAYMENT_ORDER_URLS.LIST);
  }, [navigate]);

  // Handle submit for approval (when status = draft)
  const handleSubmitForApproval = useCallback(async () => {
    if (!id || !data || data.status !== 'draft') return;

    setIsProcessing(true);
    try {
      // TODO: Call API to submit for approval
      // await paymentOrderService.submitForApproval(id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Gửi duyệt phiếu chi thành công! (Mock)');
      // Refresh data
      window.location.reload();
    } catch (submitError) {
      console.error('Error submitting payment order:', submitError);
      alert('Có lỗi xảy ra khi gửi duyệt phiếu chi');
    } finally {
      setIsProcessing(false);
    }
  }, [id, data]);

  // Handle print payment order
  const handlePrint = useCallback(async () => {
    if (!id) return;

    setIsProcessing(true);
    try {
      // TODO: Call API to print payment order
      // const result = await paymentOrderService.printPaymentOrder(id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('In phiếu chi thành công! (Mock)');
      // TODO: Implement actual PDF download
    } catch (printError) {
      console.error('Error printing payment order:', printError);
      alert('Có lỗi xảy ra khi in phiếu chi');
    } finally {
      setIsProcessing(false);
    }
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết phiếu chi">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết phiếu chi">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  const statusLabel = data ? getLabelFromOptions(data.status, STATUS_OPTIONS) : '';
  const canSubmitForApproval = data?.status === 'draft';

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}} // No submit for view mode
      enableReinitialize
    >
      <Form>
        <MainCard
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <span>{data?.code}</span>
              <Chip
                label={statusLabel}
                color={data?.status === 'paid' ? 'success' : data?.status === 'pending' ? 'warning' : 'default'}
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại danh sách
              </Button>
              <Button variant="outlined" color="info" startIcon={<FilePdfOutlined />} onClick={handlePrint} disabled={isProcessing}>
                {isProcessing ? 'Đang xử lý...' : 'In phiếu'}
              </Button>
              {canSubmitForApproval && (
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<SendOutlined />}
                  onClick={handleSubmitForApproval}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Gửi duyệt'}
                </Button>
              )}
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <PaymentOrderForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default PaymentDetailPage;
