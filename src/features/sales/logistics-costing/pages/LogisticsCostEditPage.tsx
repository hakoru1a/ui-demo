import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

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

// ==============================|| LOGISTICS COST EDIT PAGE ||============================== //

const LogisticsCostEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [cost, setCost] = useState<LogisticsCost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: LogisticsCostFormData) => {
      if (!id) return;

      // Mock API call - simulate network delay
      console.warn('Updating logistics cost:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật chi phí logistics thành công! (Mock)');
      navigate(LOGISTICS_COSTING_URLS.DETAIL(id));
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(LOGISTICS_COSTING_URLS.DETAIL(id));
    } else {
      navigate(LOGISTICS_COSTING_URLS.LIST);
    }
  }, [navigate, id]);

  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa chi phí logistics">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!cost) {
    return (
      <MainCard title="Chỉnh sửa chi phí logistics">
        <div>Không tìm thấy chi phí logistics</div>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={logisticsCostSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa chi phí logistics"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu chi phí'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <LogisticsCostForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default LogisticsCostEditPage;
