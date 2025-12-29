import { ArrowLeftOutlined, CheckOutlined, DeleteOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Alert, Box, Button, Chip, CircularProgress, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import HarvestOrderForm from '../components/HarvestOrderForm';
import { mockHarvestOrders } from '../mock/harvestOrders';
import { HARVEST_ORDER_URLS } from '../types/constants';
import { HARVEST_ORDER_STATUS } from '../types/enums';
import type { HarvestOrder, HarvestOrderFormData } from '../types/index';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: HarvestOrder): HarvestOrderFormData => ({
  code: entity.code,
  planId: entity.planId,
  forestAreaId: entity.forestAreaId,
  startDate: entity.startDate,
  actualYield: entity.actualYield,
  executorType: entity.executorType || '',
  note: entity.note || '',
  status: entity.status
});

// ==============================|| HARVEST ORDER DETAIL PAGE ||============================== //

const HarvestOrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HarvestOrder | null>(null);
  const [initialValues, setInitialValues] = useState<HarvestOrderFormData | null>(null);

  // Dialog states
  const startDialog = useBoolean(false);
  const completeDialog = useBoolean(false);
  const deleteDialog = useBoolean(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const found = mockHarvestOrders.find((item) => item.id === id);

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy lệnh khai thác');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Actions
  const handleEdit = useCallback(() => {
    if (id) navigate(HARVEST_ORDER_URLS.EDIT(id));
  }, [navigate, id]);

  const handleBack = useCallback(() => {
    navigate(HARVEST_ORDER_URLS.LIST);
  }, [navigate]);

  const handleDelete = useCallback(() => {
    deleteDialog.onTrue();
  }, [deleteDialog]);

  const handleStart = useCallback(() => {
    startDialog.onTrue();
  }, [startDialog]);

  const handleComplete = useCallback(() => {
    completeDialog.onTrue();
  }, [completeDialog]);

  // Confirm Actions
  const handleConfirmStart = async () => {
    if (!data) return;
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updated = { ...data, status: HARVEST_ORDER_STATUS.IN_PROGRESS, startedAt: new Date() };
      setData(updated as HarvestOrder);
      setInitialValues(entityToFormData(updated as HarvestOrder));
      alert('Đã bắt đầu khai thác!');
      startDialog.onFalse();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmComplete = async () => {
    if (!data) return;
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updated = { ...data, status: HARVEST_ORDER_STATUS.COMPLETED, completedAt: new Date() };
      setData(updated as HarvestOrder);
      setInitialValues(entityToFormData(updated as HarvestOrder));
      alert('Đã hoàn thành khai thác!');
      completeDialog.onFalse();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert('Đã xóa lệnh khai thác!');
      deleteDialog.onFalse();
      navigate(HARVEST_ORDER_URLS.LIST);
    } finally {
      setIsProcessing(false);
    }
  };

  // Conditions
  const isNew = data?.status === HARVEST_ORDER_STATUS.NEW;
  const isInProgress = data?.status === HARVEST_ORDER_STATUS.IN_PROGRESS;
  const canDelete = isNew;

  if (isLoading) {
    return (
      <MainCard title="Chi tiết lệnh khai thác">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (error || !initialValues) {
    return (
      <MainCard title="Chi tiết lệnh khai thác">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Lỗi không xác định'}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={() => {}} enableReinitialize>
        <Form>
          <MainCard
            title={
              <Stack direction="row" alignItems="center" spacing={2}>
                <span>
                  {data?.code} - {data?.forestAreaName}
                </span>
                <Chip
                  label={data?.status === 'new' ? 'Mới' : data?.status === 'in_progress' ? 'Đang khai thác' : 'Hoàn thành'}
                  color={data?.status === 'completed' ? 'success' : data?.status === 'in_progress' ? 'warning' : 'info'}
                  size="small"
                />
              </Stack>
            }
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                  Quay lại
                </Button>

                {isNew && (
                  <Button variant="contained" color="success" startIcon={<PlayCircleOutlined />} onClick={handleStart}>
                    Bắt đầu
                  </Button>
                )}

                {isInProgress && (
                  <Button variant="contained" color="success" startIcon={<CheckOutlined />} onClick={handleComplete}>
                    Hoàn thành
                  </Button>
                )}

                <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                  Chỉnh sửa
                </Button>

                {canDelete && (
                  <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleDelete}>
                    Xóa
                  </Button>
                )}
              </Stack>
            }
          >
            <Box sx={{ p: 1 }}>
              <HarvestOrderForm mode="view" />
            </Box>
          </MainCard>
        </Form>
      </Formik>

      {/* Start Dialog */}
      <ConfirmDialog
        open={startDialog.value}
        onClose={startDialog.onFalse}
        onConfirm={handleConfirmStart}
        title="Bắt đầu khai thác"
        message="Bạn có chắc chắn muốn chuyển trạng thái sang Đang khai thác?"
        confirmText="Bắt đầu"
        cancelText="Hủy"
        loading={isProcessing}
        confirmColor="success"
      />

      {/* Complete Dialog */}
      <ConfirmDialog
        open={completeDialog.value}
        onClose={completeDialog.onFalse}
        onConfirm={handleConfirmComplete}
        title="Hoàn thành khai thác"
        message="Bạn có chắc chắn muốn hoàn thành lệnh khai thác này? Đảm bảo đã cập nhật sản lượng thực tế."
        confirmText="Hoàn thành"
        cancelText="Hủy"
        loading={isProcessing}
        confirmColor="success"
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        onConfirm={handleConfirmDelete}
        title="Xóa lệnh khai thác"
        message="Bạn có chắc chắn muốn xóa lệnh khai thác này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        loading={isProcessing}
        confirmColor="error"
      />
    </>
  );
};

export default HarvestOrderDetailPage;
