import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, ReloadOutlined, HistoryOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert, Chip, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import CertificateHistoryDialog from '../components/CertificateHistoryDialog';
import LegalCertificateForm from '../components/LegalCertificateForm';
import { getMockCertificateById, getMockApprovalHistoryByCertificateId, getMockRenewalsByCertificateId } from '../mock/certificates';
import type { LegalCertificateFormData, LegalCertificate, CertificateApprovalHistory, CertificateRenewal } from '../types';
import { LEGAL_CERTIFICATE_URLS, CERTIFICATE_STATUS_OPTIONS } from '../types';
import { calculateCertificateStatus, formatDate, getLabelFromOptions } from '../utils';
import { legalCertificateDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: LegalCertificate): LegalCertificateFormData => ({
  certificateType: entity.certificateType,
  certificateNumber: entity.certificateNumber,
  issuingOrganization: entity.issuingOrganization,
  issueDate: entity.issueDate,
  expiryDate: entity.expiryDate,
  certificateFile: entity.certificateFile || '',
  legalNotes: entity.legalNotes
});

// ==============================|| LEGAL CERTIFICATE DETAIL PAGE ||============================== //

const LegalCertificateDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LegalCertificate | null>(null);
  const [initialValues, setInitialValues] = useState<LegalCertificateFormData>(legalCertificateDefaultValues);
  const [approvalHistory, setApprovalHistory] = useState<CertificateApprovalHistory[]>([]);
  const [renewals, setRenewals] = useState<CertificateRenewal[]>([]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        // Find mock data by ID
        const found = getMockCertificateById(id);

        if (found) {
          // Calculate status
          const status = calculateCertificateStatus(found.expiryDate);
          const certificateWithStatus = { ...found, status };
          setData(certificateWithStatus);
          setInitialValues(entityToFormData(certificateWithStatus));

          // Get approval history and renewals
          const history = getMockApprovalHistoryByCertificateId(id);
          setApprovalHistory(history);
          const certificateRenewals = getMockRenewalsByCertificateId(id);
          setRenewals(certificateRenewals);
        } else {
          setError('Không tìm thấy chứng chỉ');
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
      navigate(LEGAL_CERTIFICATE_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle renewal navigation (will open renewal dialog in edit page)
  const handleRenewal = useCallback(() => {
    if (id) {
      navigate(LEGAL_CERTIFICATE_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle delete (mock)
  const handleDelete = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chứng chỉ này?')) {
      // Mock delete
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Xóa chứng chỉ thành công! (Mock)');
      navigate(LEGAL_CERTIFICATE_URLS.LIST);
    }
  }, [navigate]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(LEGAL_CERTIFICATE_URLS.LIST);
  }, [navigate]);

  // Handle history dialog
  const handleOpenHistory = useCallback(() => {
    setShowHistoryDialog(true);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setShowHistoryDialog(false);
  }, []);

  // Check if certificate is expiring soon or expired
  const isExpiringSoon = data?.status === 'expiring_soon' || data?.status === 'expired';

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết chứng chỉ">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết chứng chỉ">
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
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}} // No submit for view mode
      enableReinitialize
    >
      <Form>
        <MainCard
          title={
            <Stack direction="row" alignItems="center" spacing={2}>
              <span>Chứng chỉ {data?.certificateNumber}</span>
              {data?.status && (
                <Chip
                  label={getLabelFromOptions(data.status, CERTIFICATE_STATUS_OPTIONS)}
                  color={
                    data.status === 'active'
                      ? 'success'
                      : data.status === 'expiring_soon'
                        ? 'warning'
                        : data.status === 'expired'
                          ? 'error'
                          : 'default'
                  }
                  size="small"
                />
              )}
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button variant="outlined" color="info" startIcon={<HistoryOutlined />} onClick={handleOpenHistory}>
                Lịch sử
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleDelete}>
                Xóa
              </Button>
              {isExpiringSoon && (
                <Button variant="contained" color="warning" startIcon={<ReloadOutlined />} onClick={handleRenewal}>
                  Gia hạn
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
              <LegalCertificateForm mode="view" />
            </Grid>

            {/* Approval History Section */}
            {approvalHistory.length > 0 && (
              <>
                <Grid size={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Lịch sử phê duyệt
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {approvalHistory.map((history) => (
                      <Box key={history.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Chip
                            label={
                              history.action === 'created'
                                ? 'Tạo mới'
                                : history.action === 'renewed'
                                  ? 'Gia hạn'
                                  : history.action === 'approved'
                                    ? 'Phê duyệt'
                                    : 'Cập nhật'
                            }
                            size="small"
                            color={history.action === 'approved' ? 'success' : 'default'}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(history.actionDate)}
                          </Typography>
                          {history.performedBy && (
                            <Typography variant="body2" color="text.secondary">
                              bởi {history.performedBy}
                            </Typography>
                          )}
                        </Stack>
                        {history.notes && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {history.notes}
                          </Typography>
                        )}
                        {history.previousExpiryDate && history.newExpiryDate && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Từ {formatDate(history.previousExpiryDate)} đến {formatDate(history.newExpiryDate)}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </MainCard>

        {/* History Dialog */}
        <CertificateHistoryDialog
          open={showHistoryDialog}
          onClose={handleCloseHistory}
          renewals={renewals}
          approvalHistory={approvalHistory}
        />
      </Form>
    </Formik>
  );
};

export default LegalCertificateDetailPage;
