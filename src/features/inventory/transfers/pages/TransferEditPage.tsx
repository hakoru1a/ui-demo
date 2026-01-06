// ==============================|| TRANSFER EDIT PAGE ||============================== //

import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Alert, Box, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import transferService from '../api/index';
import TransferForm from '../components/TransferForm';
import { getMockTransfer } from '../mock/mock';
import type { Transfer, TransferFormData } from '../types';
import { TRANSFER_URLS } from '../types/constants';
import { transferDefaultValues, transferSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Transfer): TransferFormData => ({
  code: entity.code,
  transferDate: entity.transferDate,
  sourceWarehouseId: entity.sourceWarehouseId,
  destinationWarehouseId: entity.destinationWarehouseId,
  itemType: entity.itemType,
  items: entity.items.map((item) => ({
    id: item.id,
    skuId: item.skuId,
    skuCode: item.skuCode,
    skuName: item.skuName,
    batchId: item.batchId,
    quantity: item.quantity,
    unit: item.unit,
    weight: item.weight || 0
  })),
  transportRef: entity.transportRef,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| TRANSFER EDIT PAGE ||============================== //

const TransferEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<TransferFormData>(transferDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        // TODO: Replace with API call
        const found = getMockTransfer(id);

        if (found) {
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy phiếu chuyển kho');
        }
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: TransferFormData) => {
      if (!id) return;

      // TODO: Replace with API call
      console.warn('Updating transfer:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Call API
      try {
        const response = await transferService.updateTransfer(id, values);
        if (response.success) {
          // Navigate to detail page
          navigate(TRANSFER_URLS.DETAIL(id));
        }
      } catch (err) {
        console.error('Error updating transfer:', err);
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(TRANSFER_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa phiếu chuyển kho">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa phiếu chuyển kho">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(TRANSFER_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={transferSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa phiếu chuyển kho"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu phiếu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <TransferForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default TransferEditPage;
