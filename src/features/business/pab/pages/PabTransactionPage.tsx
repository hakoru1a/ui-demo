// ==============================|| PAB TRANSACTION STATUS PAGE ||============================== //

import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import { Stack, Button, Box, CircularProgress, Alert, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import { getMockPabs } from '../mock/pabs';
import type { Pab, PabTransactionFormData } from '../types';
import { PAB_URLS, TRANSACTION_STATUS_OPTIONS } from '../types/constants';
import { pabTransactionSchema, pabTransactionDefaultValues } from '../validation';

// ==============================|| PAB TRANSACTION STATUS PAGE ||============================== //

const PabTransactionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pab, setPab] = useState<Pab | null>(null);
  const [initialValues, setInitialValues] = useState<PabTransactionFormData>({
    ...pabTransactionDefaultValues,
    pabCode: ''
  });

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = getMockPabs().find((item) => item.id === id);

      if (found) {
        setPab(found);
        setInitialValues({
          ...pabTransactionDefaultValues,
          pabCode: found.code,
          contractRef: found.contractRef || '',
          transactionStatus: found.transactionStatus || 'negotiating',
          relatedOrderIds: found.relatedOrderIds || [],
          notes: found.notes || ''
        });
      } else {
        setError('Không tìm thấy PAB');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: PabTransactionFormData) => {
      console.warn('Updating transaction status:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật trạng thái giao dịch thành công! (Mock)');
      // After updating transaction status, navigate back to detail page
      if (id) {
        navigate(PAB_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle back
  const handleBack = useCallback(() => {
    navigate(PAB_URLS.LIST);
  }, [navigate]);

  // Handle view PAB
  const handleViewPab = useCallback(() => {
    if (id) {
      navigate(PAB_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Thông tin giao dịch / Trạng thái">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Thông tin giao dịch / Trạng thái">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={pabTransactionSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
        const getError = (field: keyof PabTransactionFormData) => touched[field] && errors[field];

        return (
          <Form>
            <MainCard
              title="Thông tin giao dịch / Trạng thái"
              secondary={
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Quay lại
                  </Button>
                  <Button variant="outlined" color="info" startIcon={<EyeOutlined />} onClick={handleViewPab} disabled={isSubmitting}>
                    Xem PAB
                  </Button>
                  <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                  </Button>
                </Stack>
              }
            >
              <Grid container spacing={3} sx={{ p: 1 }}>
                {/* PAB Code - Read-only */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField name="pabCode" value={values.pabCode} label="Mã PAB" fullWidth disabled />
                </Grid>

                {/* Customer - Read-only */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField name="customer" value={pab?.customerName || ''} label="Khách hàng" fullWidth disabled />
                </Grid>

                {/* Contract Ref */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    name="contractRef"
                    value={values.contractRef || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Hợp đồng"
                    placeholder="Nhập mã hợp đồng"
                    fullWidth
                    error={!!getError('contractRef')}
                    helperText={getError('contractRef')}
                  />
                </Grid>

                {/* Transaction Status */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <SelectField
                    name="transactionStatus"
                    value={values.transactionStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Trạng thái giao dịch"
                    fullWidth
                    required
                    error={!!getError('transactionStatus')}
                    helperText={getError('transactionStatus')}
                    options={TRANSACTION_STATUS_OPTIONS}
                  />
                </Grid>

                {/* Related Orders */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    name="relatedOrders"
                    value={pab?.relatedOrderCodes?.join(', ') || ''}
                    label="Đơn liên quan"
                    placeholder="Link sang module khác"
                    fullWidth
                    disabled
                    helperText="Click để xem chi tiết đơn hàng"
                  />
                </Grid>

                {/* Last Update - Read-only */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    name="lastUpdate"
                    value={pab?.lastUpdate ? dateHelper.formatDateTime(pab.lastUpdate) : '-'}
                    label="Cập nhật gần nhất"
                    fullWidth
                    disabled
                  />
                </Grid>

                {/* Notes */}
                <Grid size={12}>
                  <RichField
                    name="notes"
                    value={values.notes || ''}
                    onChange={(value) => setFieldValue('notes', value)}
                    label="Ghi chú"
                    placeholder="Nhập ghi chú"
                    fullWidth
                    error={!!getError('notes')}
                    helperText={getError('notes')}
                  />
                </Grid>
              </Grid>
            </MainCard>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PabTransactionPage;
