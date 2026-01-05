// ==============================|| PAB DETAIL PAGE ||============================== //

import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import SendOutlined from '@ant-design/icons/SendOutlined';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import PabApprovalPipeline from '../components/PabApprovalPipeline';
import PabForm from '../components/PabForm';
import { getMockPabs } from '../mock/pabs';
import { PAB_URLS, PAB_STATUS_OPTIONS } from '../types/constants';
import type { PabFormData, Pab } from '../types/index';
import { getLabelFromOptions } from '../utils';
import { pabDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Pab): PabFormData => ({
  code: entity.code,
  customerId: entity.customerId,
  productId: entity.productId,
  quantity: entity.quantity,
  unit: entity.unit,
  expectedDeliveryDate: entity.expectedDeliveryDate,
  estimatedCost: entity.estimatedCost,
  estimatedTime: entity.estimatedTime,
  margin: entity.margin,
  notes: entity.notes,
  status: entity.status
});

// ==============================|| PAB DETAIL PAGE ||============================== //

const PabDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Pab | null>(null);
  const [initialValues, setInitialValues] = useState<PabFormData>(pabDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = getMockPabs().find((item) => item.id === id);

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy PAB');
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
      navigate(PAB_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle submit for approval
  const handleSubmitForApproval = useCallback(() => {
    if (id && data?.status === 'draft') {
      navigate(PAB_URLS.APPROVAL(id));
    }
  }, [navigate, id, data]);

  // Handle view approval
  const handleViewApproval = useCallback(() => {
    if (id && (data?.status === 'pending-approval' || data?.status === 'approved')) {
      navigate(PAB_URLS.APPROVAL(id));
    }
  }, [navigate, id, data]);

  // Handle view transaction status
  const handleViewTransaction = useCallback(() => {
    if (id && data?.status === 'approved') {
      navigate(PAB_URLS.TRANSACTION(id));
    }
  }, [navigate, id, data]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(PAB_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết PAB">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết PAB">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  const statusLabel = data ? getLabelFromOptions(data.status, PAB_STATUS_OPTIONS) : '';

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}} enableReinitialize>
      <Form>
        <MainCard
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <span>{data?.code}</span>
              <Chip
                label={statusLabel}
                color={data?.status === 'approved' ? 'success' : data?.status === 'rejected' ? 'error' : 'default'}
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              {data?.status === 'draft' && (
                <Button variant="contained" color="info" startIcon={<SendOutlined />} onClick={handleSubmitForApproval}>
                  Gửi phê duyệt
                </Button>
              )}
              {(data?.status === 'pending-approval' || data?.status === 'approved') && (
                <Button variant="outlined" color="info" onClick={handleViewApproval}>
                  Xem phê duyệt
                </Button>
              )}
              {data?.status === 'approved' && (
                <Button variant="outlined" color="success" onClick={handleViewTransaction}>
                  Xem trạng thái giao dịch
                </Button>
              )}
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          {/* Approval Pipeline UI - Show when status is pending-approval or approved */}
          {data && (data.status === 'pending-approval' || data.status === 'approved' || data.status === 'rejected') && (
            <Grid size={12}>
              <PabApprovalPipeline pab={data} />
            </Grid>
          )}
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <PabForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default PabDetailPage;
