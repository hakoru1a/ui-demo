import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

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

// ==============================|| VESSEL TRACKING EDIT PAGE ||============================== //

const VesselTrackingEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tracking, setTracking] = useState<VesselTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: VesselTrackingFormData) => {
      if (!id) return;

      // Mock API call - simulate network delay
      console.warn('Updating vessel tracking:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật chuyến tàu thành công! (Mock)');
      navigate(VESSEL_TRACKING_URLS.DETAIL(id));
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(VESSEL_TRACKING_URLS.DETAIL(id));
    } else {
      navigate(VESSEL_TRACKING_URLS.LIST);
    }
  }, [navigate, id]);

  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa chuyến tàu">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!tracking) {
    return (
      <MainCard title="Chỉnh sửa chuyến tàu">
        <div>Không tìm thấy chuyến tàu</div>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={vesselTrackingSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa chuyến tàu"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <VesselTrackingForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default VesselTrackingEditPage;
