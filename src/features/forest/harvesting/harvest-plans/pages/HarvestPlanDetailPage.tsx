import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import ConfirmWithReasonDialog from '../components/ConfirmWithReasonDialog';
import HarvestPlanForm from '../components/HarvestPlanForm';
import { mockHarvestPlans } from '../mock/harvestPlans';
import type { HarvestPlanFormData, HarvestPlan } from '../types';
import { HARVEST_PLAN_URLS } from '../types/constants';
import { harvestPlanDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: HarvestPlan): HarvestPlanFormData => ({
  code: entity.code,
  name: entity.name,
  forestAreaId: entity.forestAreaId,
  area: entity.area,
  startDate: entity.startDate,
  endDate: entity.endDate,
  expectedYield: entity.expectedYield,
  fscStandard: entity.fscStandard,
  description: entity.description,
  status: entity.status
});

// ==============================|| HARVEST PLAN DETAIL PAGE ||============================== //

const HarvestPlanDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HarvestPlan | null>(null);
  const [initialValues, setInitialValues] = useState<HarvestPlanFormData>(harvestPlanDefaultValues);

  // Dialog states
  const approveDialog = useBoolean(false);
  const cancelDialog = useBoolean(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = mockHarvestPlans.find((item) => item.id === id);

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy vùng trồng');
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
      navigate(HARVEST_PLAN_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle delete (mock)
  const handleDelete = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vùng trồng này?')) {
      // Mock delete
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Xóa vùng trồng thành công! (Mock)');
      navigate(HARVEST_PLAN_URLS.LIST);
    }
  }, [navigate]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(HARVEST_PLAN_URLS.LIST);
  }, [navigate]);

  // Handle approve
  const handleApprove = useCallback(() => {
    // Check if plan has enough information
    if (data && data.name && data.forestAreaId && data.area > 0 && data.startDate && data.endDate && data.expectedYield > 0) {
      approveDialog.onTrue();
    } else {
      alert('Vui lòng điền đầy đủ thông tin trước khi phê duyệt');
    }
  }, [data, approveDialog]);

  const handleConfirmApprove = useCallback(
    async (reason: string) => {
      if (!data) return;

      setIsProcessing(true);
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update plan status
        const updatedPlan = { ...data, status: 'active' as const, approvedAt: new Date() };
        setData(updatedPlan);
        setInitialValues(entityToFormData(updatedPlan));

        alert(`Phê duyệt kế hoạch thành công! (Mock)\nLý do: ${reason}`);
        approveDialog.onFalse();
      } catch (err) {
        console.error('Error approving plan:', err);
        alert('Có lỗi xảy ra khi phê duyệt kế hoạch');
      } finally {
        setIsProcessing(false);
      }
    },
    [data, approveDialog]
  );

  // Handle cancel plan
  const handleCancelPlan = useCallback(() => {
    // Check if plan hasn't started (status is draft)
    if (data && data.status === 'draft') {
      cancelDialog.onTrue();
    } else {
      alert('Chỉ có thể hủy kế hoạch khi chưa thực hiện (trạng thái Bản nháp)');
    }
  }, [data, cancelDialog]);

  const handleConfirmCancel = useCallback(
    async (reason: string) => {
      if (!data) return;

      setIsProcessing(true);
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update plan status
        const updatedPlan = {
          ...data,
          status: 'draft' as const,
          cancelledAt: new Date(),
          cancellationReason: reason
        };
        setData(updatedPlan);
        setInitialValues(entityToFormData(updatedPlan));

        alert(`Hủy kế hoạch thành công! (Mock)\nLý do: ${reason}`);
        cancelDialog.onFalse();
      } catch (err) {
        console.error('Error cancelling plan:', err);
        alert('Có lỗi xảy ra khi hủy kế hoạch');
      } finally {
        setIsProcessing(false);
      }
    },
    [data, cancelDialog]
  );

  // Check if plan can be approved (has enough info)
  const canApprove =
    data &&
    data.name &&
    data.forestAreaId &&
    data.area > 0 &&
    data.startDate &&
    data.endDate &&
    data.expectedYield > 0 &&
    data.status === 'draft';

  // Check if plan can be cancelled (not started)
  const canCancel = data && data.status === 'draft';

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết vùng trồng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết vùng trồng">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}} // No submit for view mode
        enableReinitialize
      >
        <Form>
          <MainCard
            title={
              <Stack direction="row" alignItems="center" spacing={2}>
                <span>{data?.name}</span>
                <Chip
                  label={data?.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  color={data?.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </Stack>
            }
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                  Quay lại danh sách
                </Button>
                {canApprove && (
                  <Button variant="contained" color="success" startIcon={<CheckOutlined />} onClick={handleApprove}>
                    Phê duyệt kế hoạch
                  </Button>
                )}
                {canCancel && (
                  <Button variant="outlined" color="warning" startIcon={<CloseOutlined />} onClick={handleCancelPlan}>
                    Hủy kế hoạch
                  </Button>
                )}
                <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleDelete}>
                  Xóa
                </Button>
                <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                  Chỉnh sửa
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <HarvestPlanForm mode="view" isApproved={!!data?.approvedAt} />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      </Formik>

      {/* Approve Dialog */}
      <ConfirmWithReasonDialog
        open={approveDialog.value}
        onClose={approveDialog.onFalse}
        onConfirm={handleConfirmApprove}
        title="Phê duyệt kế hoạch khai thác"
        message="Bạn có chắc chắn muốn phê duyệt kế hoạch này?"
        confirmText="Phê duyệt"
        cancelText="Hủy"
        confirmColor="success"
        reasonLabel="Lý do phê duyệt"
        reasonPlaceholder="Nhập lý do phê duyệt..."
        reasonRequired={true}
        loading={isProcessing}
      />

      {/* Cancel Dialog */}
      <ConfirmWithReasonDialog
        open={cancelDialog.value}
        onClose={cancelDialog.onFalse}
        onConfirm={handleConfirmCancel}
        title="Hủy kế hoạch khai thác"
        message="Bạn có chắc chắn muốn hủy kế hoạch này?"
        confirmText="Hủy kế hoạch"
        cancelText="Đóng"
        confirmColor="warning"
        reasonLabel="Lý do hủy"
        reasonPlaceholder="Nhập lý do hủy kế hoạch..."
        reasonRequired={true}
        loading={isProcessing}
      />
    </>
  );
};

export default HarvestPlanDetailPage;
