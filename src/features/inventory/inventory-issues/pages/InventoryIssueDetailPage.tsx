import { EditOutlined, PrinterOutlined, ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';
import type { CustomFile } from 'types/dropzone';

import InventoryIssueForm from '../components/InventoryIssueForm';
import { getMockInventoryIssue } from '../mock/inventoryIssues';
import type { InventoryIssue, InventoryIssueFormData } from '../types';
import { INVENTORY_ISSUE_URLS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';
import { inventoryIssueDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: InventoryIssue): InventoryIssueFormData => ({
  code: entity.code,
  issueDate: entity.issueDate,
  issueType: entity.issueType,
  warehouseId: entity.warehouseId,
  productId: entity.productId,
  batchId: entity.batchId,
  quantity: entity.quantity,
  unit: entity.unit,
  destination: entity.destination,
  referenceDoc: entity.referenceDocUrl
    ? ([{ name: entity.referenceDocUrl.split('/').pop() || 'File', preview: entity.referenceDocUrl }] as CustomFile[])
    : undefined,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| INVENTORY ISSUE DETAIL PAGE ||============================== //

const InventoryIssueDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InventoryIssue | null>(null);
  const [initialValues, setInitialValues] = useState<InventoryIssueFormData>(inventoryIssueDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        // TODO: Replace with API call
        const found = getMockInventoryIssue(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy phiếu xuất kho');
        }
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle confirm issue (when status = draft)
  const handleConfirmIssue = useCallback(async () => {
    if (id && data?.status === 'draft') {
      // TODO: Replace with API call
      console.warn('Confirming issue:', id);
      alert('Xác nhận xuất kho thành công! (Mock)');
      // Navigate to detail page to refresh
      navigate(INVENTORY_ISSUE_URLS.DETAIL(id));
    }
  }, [navigate, id, data]);

  // Handle print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Handle edit
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(INVENTORY_ISSUE_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(INVENTORY_ISSUE_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết phiếu xuất kho">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết phiếu xuất kho">
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
  const getStatusColor = (status?: InventoryIssue['status']) => {
    if (status === 'issued') return 'success';
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
              {canConfirm && (
                <Button variant="contained" color="primary" startIcon={<CheckOutlined />} onClick={handleConfirmIssue}>
                  Xác nhận xuất kho
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
              <InventoryIssueForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default InventoryIssueDetailPage;
