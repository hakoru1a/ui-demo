import { EditOutlined, ArrowLeftOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { Stack, Button, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import { EXPORT_DOCUMENT_URLS } from '../../export-documents/types/constants';
import VesselTrackingForm from '../components/VesselTrackingForm';
import type { VesselTracking, VesselTrackingFormData } from '../types';
import { VESSEL_TRACKING_URLS } from '../types/constants';
import { vesselTrackingSchema, vesselTrackingDefaultValues } from '../validation';

// Mock function to get tracking by ID - TODO: Replace with API call
const getMockTrackingById = (id: string): VesselTracking | null => {
  const mockTrackings: VesselTracking[] = [
    {
      id: '1',
      shipmentNo: 'SHIP-001',
      exportOrderId: '1',
      exportOrderNo: 'XK001',
      vesselName: 'MV Evergreen',
      voyageNo: 'V001',
      portOfLoading: 'HCM',
      portOfDischarge: 'SINGAPORE',
      etd: new Date('2024-01-15'),
      eta: new Date('2024-01-22'),
      currentStatus: 'running',
      trackingMap: '16.0544,108.2022'
    }
  ];
  return mockTrackings.find((t) => t.id === id) || null;
};

// ==============================|| VESSEL TRACKING DETAIL PAGE ||============================== //

const VesselTrackingDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tracking, setTracking] = useState<VesselTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load tracking data
  useEffect(() => {
    if (id) {
      // Mock API call
      const mockTracking = getMockTrackingById(id);
      setTracking(mockTracking);
      setIsLoading(false);
    }
  }, [id]);

  // Convert entity to form data
  const entityToFormData = (entity: VesselTracking): VesselTrackingFormData => {
    return {
      shipmentNo: entity.shipmentNo,
      exportOrderId: entity.exportOrderId,
      vesselName: entity.vesselName,
      voyageNo: entity.voyageNo,
      portOfLoading: entity.portOfLoading,
      portOfDischarge: entity.portOfDischarge,
      etd: entity.etd,
      eta: entity.eta,
      currentStatus: entity.currentStatus,
      billOfLading: entity.billOfLading,
      trackingMap: entity.trackingMap,
      notes: entity.notes
    };
  };

  // Initial form values
  const initialValues: VesselTrackingFormData = tracking ? entityToFormData(tracking) : vesselTrackingDefaultValues;

  // Handle edit
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(VESSEL_TRACKING_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(VESSEL_TRACKING_URLS.LIST);
  }, [navigate]);

  // Handle update status (Cập nhật trạng thái)
  const handleUpdateStatus = useCallback(async () => {
    if (!id || !tracking) return;

    setIsUpdatingStatus(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await vesselTrackingService.updateStatus(id, tracking.currentStatus === 'running' ? 'arrived' : 'running');
      const newStatus = tracking.currentStatus === 'running' ? 'arrived' : 'running';
      alert(`Cập nhật trạng thái thành công! (Mock - ${newStatus === 'running' ? 'Đang chạy' : 'Đã đến'})`);
      // Reload tracking
      const updatedTracking = { ...tracking, currentStatus: newStatus };
      setTracking(updatedTracking);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [id, tracking]);

  // Handle refresh tracking (Làm mới tracking)
  const handleRefreshTracking = useCallback(async () => {
    if (!id) return;

    setIsRefreshing(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await vesselTrackingService.refreshTracking(id);
      alert('Làm mới tracking thành công! (Mock)');
      // TODO: Reload tracking data
    } catch (error) {
      console.error('Error refreshing tracking:', error);
      alert('Có lỗi xảy ra khi làm mới tracking');
    } finally {
      setIsRefreshing(false);
    }
  }, [id]);

  // Handle view related documents (Xem chứng từ liên quan)
  const handleViewRelatedDocuments = useCallback(() => {
    if (tracking?.exportOrderId) {
      // Navigate to export documents list filtered by export order
      navigate(EXPORT_DOCUMENT_URLS.LIST + `?exportOrderId=${tracking.exportOrderId}`);
    }
  }, [navigate, tracking]);

  if (isLoading) {
    return (
      <MainCard title="Chi tiết chuyến tàu">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!tracking) {
    return (
      <MainCard title="Chi tiết chuyến tàu">
        <div>Không tìm thấy chuyến tàu</div>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={vesselTrackingSchema}
      onSubmit={() => {}}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize
    >
      <Form>
        <MainCard
          title="Chi tiết chuyến tàu"
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button variant="outlined" color="info" startIcon={<FileTextOutlined />} onClick={handleViewRelatedDocuments}>
                Xem chứng từ liên quan
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<ReloadOutlined />}
                onClick={handleRefreshTracking}
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Đang làm mới...' : 'Làm mới tracking'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditOutlined />}
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <VesselTrackingForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default VesselTrackingDetailPage;
