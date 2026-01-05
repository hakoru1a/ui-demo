import { EditOutlined, ArrowLeftOutlined, PrinterOutlined, CheckOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import StocktakeForm from '../components/StocktakeForm';
import { getMockStocktake } from '../mock/mock';
import type { Stocktake, StocktakeFormData } from '../types';
import { STOCKTAKE_STATUS_OPTIONS, STOCKTAKE_URLS } from '../types/constants';
import { getLabelFromOptions } from '../types/constants';
import { stocktakeDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

// Helper function to convert entity to form data (exported for use in EditPage)
export const entityToFormData = (entity: Stocktake): StocktakeFormData => ({
  code: entity.code,
  inventoryDate: entity.inventoryDate,
  warehouseId: entity.warehouseId,
  items: entity.items.map((item) => ({
    id: item.id,
    skuId: item.skuId,
    skuCode: item.skuCode,
    skuName: item.skuName,
    systemQty: item.systemQty,
    actualQty: item.actualQty,
    difference: item.difference,
    reason: item.reason
  })),
  status: entity.status,
  notes: entity.notes
});

// ==============================|| STOCKTAKE DETAIL PAGE ||============================== //

const StocktakeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Stocktake | null>(null);
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

  // Handle edit navigation
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(STOCKTAKE_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(STOCKTAKE_URLS.LIST);
  }, [navigate]);

  // Handle print
  const handlePrint = useCallback(() => {
    // TODO: Implement print functionality
    console.warn('Print stocktake - Not implemented yet');
    window.print();
  }, []);

  // Handle confirm stocktake (change status from draft to completed)
  const handleConfirmStocktake = useCallback(async () => {
    if (!id || !data) return;

    // TODO: Replace with API call
    console.warn('Confirming stocktake:', id);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert('Xác nhận kiểm kê thành công! (Mock)');
    // Refresh data
    const found = getMockStocktake(id);
    if (found) {
      setData({ ...found, status: 'completed' });
      setInitialValues(entityToFormData({ ...found, status: 'completed' }));
    }
  }, [id, data]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Thông tin phiếu kiểm kê">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Thông tin phiếu kiểm kê">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  const statusLabel = data ? getLabelFromOptions(data.status, STOCKTAKE_STATUS_OPTIONS) : '';
  const getStatusColor = (status?: Stocktake['status']) => {
    if (status === 'completed') return 'success';
    if (status === 'draft') return 'warning';
    return 'default';
  };

  const canEdit = data?.status === 'draft';
  const canConfirm = data?.status === 'draft';

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
              <span>
                {data?.code} - {data?.warehouseName}
              </span>
              <Chip label={statusLabel} color={getStatusColor(data?.status)} size="small" />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button variant="outlined" color="info" startIcon={<PrinterOutlined />} onClick={handlePrint}>
                In phiếu
              </Button>
              {canConfirm && (
                <Button variant="contained" color="success" startIcon={<CheckOutlined />} onClick={handleConfirmStocktake}>
                  Xác nhận kiểm kê
                </Button>
              )}
              {canEdit && (
                <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                  Chỉnh sửa
                </Button>
              )}
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <StocktakeForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default StocktakeDetailPage;
