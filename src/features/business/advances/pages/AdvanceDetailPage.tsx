import { EditOutlined, ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import AdvanceForm from '../components/AdvanceForm';
import { getMockAdvance } from '../mock/mock';
import type { Advance, AdvanceFormData } from '../types';
import { ADVANCE_URLS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';
import { advanceDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Advance): AdvanceFormData => ({
  code: entity.code,
  requesterId: entity.requesterId,
  requestedDate: entity.requestedDate,
  requestedAmount: entity.requestedAmount,
  purpose: entity.purpose,
  status: entity.status
});

// ==============================|| ADVANCE DETAIL PAGE ||============================== //

const AdvanceDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Advance | null>(null);
  const [initialValues, setInitialValues] = useState<AdvanceFormData>(advanceDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        // TODO: Replace with API call
        const found = getMockAdvance(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy phiếu tạm ứng');
        }
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
      navigate(ADVANCE_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(ADVANCE_URLS.LIST);
  }, [navigate]);

  // Handle navigate to approval page (when status = pending)
  const handleApproval = useCallback(() => {
    if (id && data?.status === 'pending') {
      navigate(ADVANCE_URLS.APPROVAL(id));
    }
  }, [navigate, id, data]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết phiếu tạm ứng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết phiếu tạm ứng">
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
  const canApprove = data?.status === 'pending';
  const getStatusColor = (status?: Advance['status']) => {
    if (status === 'approved') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'rejected') return 'error';
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
                Quay lại danh sách
              </Button>
              {canApprove && (
                <Button variant="contained" color="primary" startIcon={<CheckOutlined />} onClick={handleApproval}>
                  Phê duyệt
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
              <AdvanceForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default AdvanceDetailPage;
