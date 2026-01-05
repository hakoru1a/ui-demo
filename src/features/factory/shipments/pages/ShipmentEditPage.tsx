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

import { shipmentService } from '../api';
import ShipmentForm from '../components/ShipmentForm';
import { getMockShipments } from '../mock/shipments';
import type { ShipmentFormData, Shipment } from '../types';
import { SHIPMENT_URLS } from '../types/constants';
import { shipmentSchema, shipmentDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Shipment): ShipmentFormData => ({
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

// ==============================|| SHIPMENT EDIT PAGE ||============================== //

const ShipmentEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<ShipmentFormData>(shipmentDefaultValues);
  const [originalData, setOriginalData] = useState<Shipment | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try API first, fallback to mock
        if (id && !id.startsWith('mock-')) {
          const response = await shipmentService.getShipmentById(id);
          if (response.success && response.data) {
            setOriginalData(response.data);
            setInitialValues(entityToFormData(response.data));
          } else {
            // Fallback to mock
            const mockShipments = getMockShipments();
            const found = mockShipments.find((item) => item.id === id);
            if (found) {
              setOriginalData(found);
              setInitialValues(entityToFormData(found));
            } else {
              setError('Không tìm thấy phiếu xuất');
            }
          }
        } else {
          // Use mock data
          const mockShipments = getMockShipments();
          const found = mockShipments.find((item) => item.id === id);
          if (found) {
            setOriginalData(found);
            setInitialValues(entityToFormData(found));
          } else {
            setError('Không tìm thấy phiếu xuất');
          }
        }
      } catch (err) {
        console.error('Error fetching shipment:', err);
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
    async (values: ShipmentFormData) => {
      if (!id) return;

      try {
        if (!id.startsWith('mock-')) {
          const response = await shipmentService.updateShipment(id, values);
          if (response.success && response.data) {
            openSnackbar({
              open: true,
              message: 'Cập nhật phiếu xuất thành công',
              variant: 'alert',
              alert: { color: 'success' }
            } as SnackbarProps);
            navigate(SHIPMENT_URLS.DETAIL(id));
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
          navigate(SHIPMENT_URLS.DETAIL(id));
        }
      } catch (err) {
        console.error('Error updating shipment:', err);
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
      navigate(SHIPMENT_URLS.DETAIL(id));
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
        <Button variant="outlined" onClick={() => navigate(SHIPMENT_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={shipmentSchema}
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
                <ShipmentForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default ShipmentEditPage;
