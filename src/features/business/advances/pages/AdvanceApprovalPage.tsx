import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { Button, Stack } from '@mui/material';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import { openSnackbar } from 'api/snackbar';
import MainCard from 'components/MainCard';
import type { SnackbarProps } from 'types/snackbar';

import advanceService from '../api/index';
import AdvanceApprovalForm from '../components/AdvanceApprovalForm';
import { getMockAdvance } from '../mock/mock';
import type { Advance, AdvanceApprovalFormData } from '../types';
import { ADVANCE_URLS } from '../types/constants';
import { advanceApprovalDefaultValues, advanceApprovalSchema } from '../validation';

// ==============================|| ADVANCE APPROVAL PAGE ||============================== //

const AdvanceApprovalPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advance, setAdvance] = useState<Advance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load advance data
  useEffect(() => {
    const loadAdvance = async () => {
      if (!id) {
        navigate(ADVANCE_URLS.LIST);
        return;
      }

      setIsLoading(true);
      try {
        // TODO: Replace with API call
        const found = getMockAdvance(id);
        if (found) {
          setAdvance(found);
        } else {
          openSnackbar({
            open: true,
            message: 'Không tìm thấy phiếu tạm ứng',
            variant: 'alert',
            alert: { color: 'error' }
          } as SnackbarProps);
          navigate(ADVANCE_URLS.LIST);
        }
      } catch (error) {
        console.error('Error loading advance:', error);
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi tải phiếu tạm ứng',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
        navigate(ADVANCE_URLS.LIST);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdvance();
  }, [id, navigate]);

  // Initialize form values from advance data
  const getInitialValues = (): AdvanceApprovalFormData => {
    if (!advance) {
      return advanceApprovalDefaultValues;
    }

    return {
      code: advance.code,
      requesterName: advance.requesterName,
      requestedAmount: advance.requestedAmount,
      purpose: advance.purpose,
      approvalDecision: 'approve',
      comment: advance.comment || '',
      approvalDate: new Date(),
      status: advance.status === 'pending' ? 'pending' : advance.status
    };
  };

  // Handle form submission
  const handleSubmit = async (values: AdvanceApprovalFormData) => {
    if (!id || !advance) return;

    setIsSubmitting(true);
    try {
      // Update status based on decision
      const newStatus: Advance['status'] = values.approvalDecision === 'approve' ? 'approved' : 'rejected';

      const payload: AdvanceApprovalFormData = {
        ...values,
        status: newStatus
      };

      // TODO: Replace with API call
      const response = await advanceService.approveAdvance(id, payload);

      if (response.success) {
        openSnackbar({
          open: true,
          message: values.approvalDecision === 'approve' ? 'Duyệt phiếu tạm ứng thành công' : 'Từ chối phiếu tạm ứng thành công',
          variant: 'alert',
          alert: { color: 'success' }
        } as SnackbarProps);

        // Navigate back to list
        navigate(ADVANCE_URLS.LIST);
      } else {
        openSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi phê duyệt phiếu tạm ứng',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      console.error('Error approving advance:', error);
      openSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi phê duyệt phiếu tạm ứng',
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate(ADVANCE_URLS.LIST);
  };

  if (isLoading) {
    return (
      <MainCard title="Phê duyệt tạm ứng">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!advance) {
    return null;
  }

  return (
    <MainCard
      title="Phê duyệt tạm ứng"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="inherit" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      }
    >
      <Formik initialValues={getInitialValues()} validationSchema={advanceApprovalSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ handleSubmit: formikHandleSubmit, values, errors, touched }) => {
          const canApprove = values.approvalDecision === 'approve';
          const canReject = values.approvalDecision === 'reject' && values.comment && values.comment.trim().length > 0;
          const isValid = canApprove || canReject;

          return (
            <form onSubmit={formikHandleSubmit}>
              <AdvanceApprovalForm />

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button variant="outlined" color="inherit" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                  Quay lại
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseOutlined />}
                  onClick={() => {
                    // Set decision to reject
                    // This will be handled by form submission
                  }}
                  disabled={!canReject || isSubmitting}
                  type="button"
                  sx={{ display: 'none' }} // Hidden, handled by main submit button
                >
                  Từ chối
                </Button>
                <Button
                  variant="contained"
                  color={values.approvalDecision === 'approve' ? 'primary' : 'error'}
                  startIcon={values.approvalDecision === 'approve' ? <CheckOutlined /> : <CloseOutlined />}
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  {values.approvalDecision === 'approve' ? 'Duyệt tạm ứng' : 'Từ chối'}
                </Button>
              </Stack>
            </form>
          );
        }}
      </Formik>
    </MainCard>
  );
};

export default AdvanceApprovalPage;
