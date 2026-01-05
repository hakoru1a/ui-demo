// ==============================|| PAB APPROVAL PIPELINE ||============================== //

import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import { Box, Stack, Step, StepLabel, Stepper, Typography, Chip } from '@mui/material';

import { APPROVAL_LAYER_OPTIONS } from '../types/constants';
import type { Pab } from '../types/index';
import { getLabelFromOptions } from '../utils';

interface PabApprovalPipelineProps {
  pab: Pab;
}

// ==============================|| PAB APPROVAL PIPELINE ||============================== //

const PabApprovalPipeline = ({ pab }: PabApprovalPipelineProps) => {
  const approvalHistory = pab.approvalHistory || [];
  const currentStatus = pab.status;

  // Define approval steps
  const approvalSteps = [
    { layer: 'business' as const, label: 'Kinh doanh', order: 1 },
    { layer: 'finance' as const, label: 'Tài chính', order: 2 },
    { layer: 'management' as const, label: 'BLĐ', order: 3 }
  ];

  // Get current step based on status
  const getCurrentStep = () => {
    if (currentStatus === 'draft') return 0;
    if (currentStatus === 'pending-approval') {
      // Find the first pending approval
      const lastApproval = approvalHistory[approvalHistory.length - 1];
      if (lastApproval) {
        const stepIndex = approvalSteps.findIndex((step) => step.layer === lastApproval.approvalLayer);
        return stepIndex >= 0 ? stepIndex + 1 : 1;
      }
      return 1;
    }
    if (currentStatus === 'approved') return approvalSteps.length;
    if (currentStatus === 'rejected') {
      // Find the rejection step
      const rejectedApproval = approvalHistory.find((h) => h.decision === 'rejected');
      if (rejectedApproval) {
        const stepIndex = approvalSteps.findIndex((step) => step.layer === rejectedApproval.approvalLayer);
        return stepIndex >= 0 ? stepIndex + 1 : 0;
      }
      return 0;
    }
    return 0;
  };

  const currentStep = getCurrentStep();

  // Get approval status for each step
  const getStepStatus = (stepIndex: number) => {
    const step = approvalSteps[stepIndex];
    if (!step) return 'pending';

    // Check if this step has been approved
    const stepApproval = approvalHistory.find((h) => h.approvalLayer === step.layer);
    if (stepApproval) {
      if (stepApproval.decision === 'approved') return 'completed';
      if (stepApproval.decision === 'rejected') return 'rejected';
    }

    // Check if this is the current step
    if (stepIndex + 1 === currentStep && currentStatus === 'pending-approval') return 'active';

    // Check if previous steps are completed
    if (stepIndex < currentStep) return 'completed';

    return 'pending';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#4CAF50' }} />;
      case 'rejected':
        return <CloseCircleOutlined style={{ color: '#F44336' }} />;
      case 'active':
        return <ClockCircleOutlined style={{ color: '#2196F3' }} />;
      default:
        return <FileTextOutlined style={{ color: '#9E9E9E' }} />;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Quy trình phê duyệt
      </Typography>
      <Stepper activeStep={currentStep} orientation="horizontal" sx={{ mb: 2 }}>
        {approvalSteps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <Step key={step.layer} completed={status === 'completed'} active={status === 'active'}>
              <StepLabel
                StepIconComponent={() => getStepIcon(status)}
                error={status === 'rejected'}
                optional={
                  <Typography variant="caption" color={status === 'rejected' ? 'error' : 'text.secondary'}>
                    {status === 'completed' && 'Đã duyệt'}
                    {status === 'rejected' && 'Đã từ chối'}
                    {status === 'active' && 'Đang chờ'}
                    {status === 'pending' && 'Chưa xử lý'}
                  </Typography>
                }
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {/* Approval History */}
      {approvalHistory.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Lịch sử phê duyệt
          </Typography>
          <Stack spacing={1}>
            {approvalHistory.map((history) => (
              <Box
                key={history.id}
                sx={{
                  p: 1.5,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: history.decision === 'approved' ? 'success.lighter' : 'error.lighter'
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={getLabelFromOptions(history.approvalLayer, APPROVAL_LAYER_OPTIONS)}
                      size="small"
                      color={history.decision === 'approved' ? 'success' : 'error'}
                    />
                    <Typography variant="body2">{history.approverName}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={history.decision === 'approved' ? 'Duyệt' : 'Từ chối'}
                      size="small"
                      color={history.decision === 'approved' ? 'success' : 'error'}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {typeof history.approvalDate === 'string'
                        ? new Date(history.approvalDate).toLocaleDateString('vi-VN')
                        : history.approvalDate.toLocaleDateString('vi-VN')}
                    </Typography>
                  </Stack>
                </Stack>
                {history.comment && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {history.comment}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default PabApprovalPipeline;
