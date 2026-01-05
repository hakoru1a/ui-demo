import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';
import type { CustomFile } from 'types/dropzone';

import inventoryReceiptService from '../api/index';
import InventoryReceiptForm from '../components/InventoryReceiptForm';
import { getMockInventoryReceipt } from '../mock/mock';
import type { InventoryReceipt, InventoryReceiptFormData } from '../types';
import { INVENTORY_RECEIPT_URLS } from '../types/constants';
import { inventoryReceiptDefaultValues, inventoryReceiptSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: InventoryReceipt): InventoryReceiptFormData => ({
  code: entity.code,
  receiptDate: entity.receiptDate,
  receiptType: entity.receiptType,
  warehouseId: entity.warehouseId,
  productId: entity.productId,
  batchId: entity.batchId,
  quantity: entity.quantity,
  unit: entity.unit,
  source: entity.source,
  referenceDoc: entity.referenceDocUrl
    ? ([{ name: entity.referenceDocUrl.split('/').pop() || 'File', preview: entity.referenceDocUrl }] as CustomFile[])
    : undefined,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| INVENTORY RECEIPT EDIT PAGE ||============================== //

const InventoryReceiptEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<InventoryReceiptFormData>(inventoryReceiptDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        // TODO: Replace with API call
        const found = getMockInventoryReceipt(id);

        if (found) {
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy phiếu nhập kho');
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
    async (values: InventoryReceiptFormData) => {
      if (!id) return;

      // TODO: Replace with API call
      console.warn('Updating inventory receipt:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Call API
      try {
        const response = await inventoryReceiptService.updateInventoryReceipt(id, values);
        if (response.success) {
          // Navigate to detail page
          navigate(INVENTORY_RECEIPT_URLS.DETAIL(id));
        }
      } catch (err) {
        console.error('Error updating inventory receipt:', err);
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(INVENTORY_RECEIPT_URLS.DETAIL(id));
    } else {
      navigate(INVENTORY_RECEIPT_URLS.LIST);
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa phiếu nhập kho">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa phiếu nhập kho">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(INVENTORY_RECEIPT_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={inventoryReceiptSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa phiếu nhập kho"
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
                <InventoryReceiptForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default InventoryReceiptEditPage;
