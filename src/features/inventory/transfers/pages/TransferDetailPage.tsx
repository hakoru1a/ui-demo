// ==============================|| TRANSFER DETAIL PAGE ||============================== //

import { ArrowLeftOutlined, CheckOutlined, EditOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, Box, Button, Chip, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import TransferForm from '../components/TransferForm';
import { getMockTransfer } from '../mock/mock';
import type { Transfer, TransferFormData } from '../types';
import { getLabelFromOptions, STATUS_OPTIONS, TRANSFER_URLS } from '../types/constants';
import { transferDefaultValues } from '../validation';

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
    unit: item.unit
  })),
  transportRef: entity.transportRef,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| TRANSFER DETAIL PAGE ||============================== //

const TransferDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Transfer | null>(null);
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
          setData(found);
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

  // Handle confirm transfer (when status = draft)
  const handleConfirmTransfer = useCallback(async () => {
    if (id && data?.status === 'draft') {
      // TODO: Replace with API call
      console.warn('Confirming transfer:', id);
      alert('Xác nhận chuyển kho thành công! (Mock)');
      // Navigate to detail page to refresh
      navigate(TRANSFER_URLS.DETAIL(id));
    }
  }, [navigate, id, data]);

  // Handle view traceability (when has batch)
  const handleViewTraceability = useCallback(() => {
    if (data && id) {
      navigate(TRANSFER_URLS.TRACEABILITY(id));
    }
  }, [navigate, data, id]);

  // Handle print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Handle edit
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(TRANSFER_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(TRANSFER_URLS.LIST);
  }, [navigate]);

  // Check if has batch for traceability
  const hasBatch = data?.items.some((item) => item.batchId) ?? false;

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết phiếu chuyển kho">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết phiếu chuyển kho">
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
  const canConfirm = data?.status === 'draft';
  const getStatusColor = (status?: Transfer['status']) => {
    if (status === 'transferred') return 'success';
    if (status === 'draft') return 'warning';
    if (status === 'cancelled') return 'error';
    return 'default';
  };

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
              {hasBatch && (
                <Button variant="outlined" color="info" startIcon={<SearchOutlined />} onClick={handleViewTraceability}>
                  Xem truy xuất nguồn gốc
                </Button>
              )}
              {canConfirm && (
                <Button variant="contained" color="primary" startIcon={<CheckOutlined />} onClick={handleConfirmTransfer}>
                  Xác nhận chuyển kho
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
              <TransferForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default TransferDetailPage;
