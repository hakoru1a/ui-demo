import { EditOutlined, ArrowLeftOutlined, CheckOutlined, PrinterOutlined } from '@ant-design/icons';
import { Stack, Button, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import { openSnackbar } from 'api/snackbar';
import MainCard from 'components/MainCard';
import type { SnackbarProps } from 'types/snackbar';

import LogisticsCostForm from '../components/LogisticsCostForm';
import { getMockLogisticsCosts } from '../mock/logisticsCosts';
import type { LogisticsCost, LogisticsCostFormData } from '../types';
import { LOGISTICS_COSTING_URLS } from '../types/constants';
import { logisticsCostSchema, logisticsCostDefaultValues } from '../validation';

// Mock function to get cost by ID - TODO: Replace with API call
const getMockCostById = (id: string): LogisticsCost | null => {
  const mockCosts = getMockLogisticsCosts();
  return mockCosts.find((c) => c.id === id) || null;
};

// ==============================|| LOGISTICS COST DETAIL PAGE ||============================== //

const LogisticsCostDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [cost, setCost] = useState<LogisticsCost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // Load cost data
  useEffect(() => {
    if (id) {
      // Mock API call
      const mockCost = getMockCostById(id);
      setCost(mockCost);
      setIsLoading(false);
    }
  }, [id]);

  // Convert entity to form data
  const entityToFormData = (entity: LogisticsCost): LogisticsCostFormData => {
    return {
      costCode: entity.costCode,
      costType: entity.costType,
      serviceCategory: entity.serviceCategory,
      partnerId: entity.partnerId,
      relatedShipmentId: entity.relatedShipmentId,
      relatedOrderId: entity.relatedOrderId,
      costDate: entity.costDate,
      amount: entity.amount,
      currency: entity.currency,
      allocationMethod: entity.allocationMethod,
      attachment: entity.attachment,
      status: entity.status,
      notes: entity.notes
    };
  };

  // Initial form values
  const initialValues: LogisticsCostFormData = cost ? entityToFormData(cost) : logisticsCostDefaultValues;

  // Handle edit
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(LOGISTICS_COSTING_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(LOGISTICS_COSTING_URLS.LIST);
  }, [navigate]);

  // Handle record cost (change status from draft to recorded)
  const handleRecord = useCallback(async () => {
    if (!id || !cost) return;

    setIsRecording(true);
    try {
      // Mock API call - simulate network delay
      console.warn('Recording logistics cost:', id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setCost({ ...cost, status: 'recorded' });

      // Show success notification
      openSnackbar({
        open: true,
        message: 'Đã ghi nhận chi phí thành công',
        variant: 'alert',
        alert: { color: 'success' }
      } as SnackbarProps);
    } catch (error) {
      console.error('Error recording cost:', error);
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi ghi nhận chi phí',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsRecording(false);
    }
  }, [id, cost]);

  // Handle print
  const handlePrint = useCallback(() => {
    // TODO: Implement print functionality
    console.warn('Print cost - Not implemented yet');
    window.print();
  }, []);

  if (isLoading) {
    return (
      <MainCard title="Chi tiết chi phí logistics">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!cost) {
    return (
      <MainCard title="Chi tiết chi phí logistics">
        <div>Không tìm thấy chi phí logistics</div>
      </MainCard>
    );
  }

  const canRecord = cost.status === 'draft';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={logisticsCostSchema}
      onSubmit={() => {}}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize
    >
      <Form>
        <MainCard
          title="Chi tiết chi phí logistics"
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button variant="outlined" color="info" startIcon={<PrinterOutlined />} onClick={handlePrint}>
                In phiếu
              </Button>
              {canRecord && (
                <Button variant="contained" color="success" startIcon={<CheckOutlined />} onClick={handleRecord} disabled={isRecording}>
                  {isRecording ? 'Đang ghi nhận...' : 'Ghi nhận chi phí'}
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
              <LogisticsCostForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default LogisticsCostDetailPage;
