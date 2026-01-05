import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import { openSnackbar } from 'api/snackbar';
import MainCard from 'components/MainCard';
import type { SnackbarProps } from 'types/snackbar';

import { inventoryIssueService } from '../api';
import InventoryIssueForm from '../components/InventoryIssueForm';
import { getMockInventoryIssues } from '../mock/inventoryIssues';
import type { InventoryIssueFormData, InventoryIssue } from '../types';
import { INVENTORY_ISSUE_URLS } from '../types/constants';
import { inventoryIssueSchema, inventoryIssueDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: InventoryIssue): InventoryIssueFormData => ({
  code: entity.code,
  issueDate: entity.issueDate,
  issueType: entity.issueType,
  warehouseId: entity.warehouseId,
  destinationId: entity.destinationId || '',
  destinationType: entity.destinationType,
  customerId: entity.customerId,
  productId: entity.productId,
  batchId: entity.batchId,
  quantity: entity.quantity,
  transportRef: entity.transportRef,
  referenceDoc: entity.referenceDoc,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| INVENTORY ISSUE EDIT PAGE ||============================== //

const InventoryIssueEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<InventoryIssueFormData>(inventoryIssueDefaultValues);
  const [originalData, setOriginalData] = useState<InventoryIssue | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try API first, fallback to mock
        if (id && !id.startsWith('mock-')) {
          const response = await inventoryIssueService.getInventoryIssueById(id);
          if (response.success && response.data) {
            setOriginalData(response.data);
            setInitialValues(entityToFormData(response.data));
          } else {
            // Fallback to mock
            const mockIssues = getMockInventoryIssues();
            const found = mockIssues.find((item) => item.id === id);
            if (found) {
              setOriginalData(found);
              setInitialValues(entityToFormData(found));
            } else {
              setError('Không tìm thấy phiếu xuất');
            }
          }
        } else {
          // Use mock data
          const mockIssues = getMockInventoryIssues();
          const found = mockIssues.find((item) => item.id === id);
          if (found) {
            setOriginalData(found);
            setInitialValues(entityToFormData(found));
          } else {
            setError('Không tìm thấy phiếu xuất');
          }
        }
      } catch (err) {
        console.error('Error fetching inventory issue:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: InventoryIssueFormData) => {
      if (!id) return;

      try {
        if (!id.startsWith('mock-')) {
          const response = await inventoryIssueService.updateInventoryIssue(id, values);
          if (response.success && response.data) {
            openSnackbar({
              open: true,
              message: 'Cập nhật phiếu xuất thành công',
              variant: 'alert',
              alert: { color: 'success' }
            } as SnackbarProps);
            navigate(INVENTORY_ISSUE_URLS.DETAIL(id));
          } else {
            openSnackbar({
              open: true,
              message: 'Có lỗi xảy ra khi cập nhật phiếu xuất',
              variant: 'alert',
              alert: { color: 'error' }
            } as SnackbarProps);
          }
        } else {
          // Mock success
          openSnackbar({
            open: true,
            message: 'Cập nhật phiếu xuất thành công (Mock)',
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);
          navigate(INVENTORY_ISSUE_URLS.DETAIL(id));
        }
      } catch (err) {
        console.error('Error updating inventory issue:', err);
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi cập nhật phiếu xuất',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(INVENTORY_ISSUE_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa phiếu xuất">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa phiếu xuất">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(INVENTORY_ISSUE_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={inventoryIssueSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty, values }) => (
        <Form>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.code || ''}`}
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <InventoryIssueForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default InventoryIssueEditPage;
