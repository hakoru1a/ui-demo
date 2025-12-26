import { SaveOutlined, CloseOutlined, ReloadOutlined, HistoryOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import CertificateHistoryDialog from '../components/CertificateHistoryDialog';
import CertificateRenewalWorkflow from '../components/CertificateRenewalWorkflow';
import LegalCertificateForm from '../components/LegalCertificateForm';
import { getMockCertificateById, getMockApprovalHistoryByCertificateId, getMockRenewalsByCertificateId } from '../mock/certificates';
import type {
  LegalCertificateFormData,
  LegalCertificate,
  CertificateRenewalFormData,
  CertificateRenewal,
  CertificateApprovalHistory
} from '../types';
import { LEGAL_CERTIFICATE_URLS } from '../types';
import { calculateCertificateStatus } from '../utils';
import { legalCertificateSchema, legalCertificateDefaultValues } from '../validation';

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

// ==============================|| LEGAL CERTIFICATE EDIT PAGE ||============================== //

const LegalCertificateEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<LegalCertificateFormData>(legalCertificateDefaultValues);
  const [originalData, setOriginalData] = useState<LegalCertificate | null>(null);
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [renewals, setRenewals] = useState<CertificateRenewal[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<CertificateApprovalHistory[]>([]);
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
          setOriginalData(certificateWithStatus);
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

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: LegalCertificateFormData) => {
      console.warn('Updating legal certificate:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật chứng chỉ thành công! (Mock)');
      if (id) {
        navigate(LEGAL_CERTIFICATE_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(LEGAL_CERTIFICATE_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Handle renewal
  const handleRenewal = useCallback(() => {
    setShowRenewalDialog(true);
  }, []);

  // Handle renewal complete
  const handleRenewalComplete = useCallback(
    (renewalData: CertificateRenewalFormData) => {
      console.warn('Renewal completed:', renewalData);
      // In real app, this would update the certificate
      alert('Gia hạn thành công! (Mock)');
      setShowRenewalDialog(false);
      // Navigate to detail page to see updated certificate
      setTimeout(() => {
        if (id) {
          navigate(LEGAL_CERTIFICATE_URLS.DETAIL(id));
        }
      }, 1000);
    },
    [navigate, id]
  );

  // Handle renewal cancel
  const handleRenewalCancel = useCallback(() => {
    setShowRenewalDialog(false);
  }, []);

  // Handle history dialog
  const handleOpenHistory = useCallback(() => {
    setShowHistoryDialog(true);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setShowHistoryDialog(false);
  }, []);

  // Check if certificate is expiring soon or expired
  const isExpiringSoon = originalData?.status === 'expiring_soon' || originalData?.status === 'expired';

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa chứng chỉ">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa chứng chỉ">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(LEGAL_CERTIFICATE_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={legalCertificateSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty, values }) => (
        <Form>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.certificateNumber || ''}`}
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button variant="outlined" color="info" startIcon={<HistoryOutlined />} onClick={handleOpenHistory} disabled={isSubmitting}>
                  Lịch sử
                </Button>
                {isExpiringSoon && (
                  <Button variant="outlined" color="warning" startIcon={<ReloadOutlined />} onClick={handleRenewal} disabled={isSubmitting}>
                    Gia hạn
                  </Button>
                )}
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <LegalCertificateForm mode="edit" />
              </Grid>
            </Grid>

            {/* Renewal Workflow */}
            {showRenewalDialog && originalData && (
              <Grid size={12} sx={{ mt: 3 }}>
                <CertificateRenewalWorkflow
                  certificateId={originalData.id}
                  currentExpiryDate={originalData.expiryDate}
                  onComplete={handleRenewalComplete}
                  onCancel={handleRenewalCancel}
                />
              </Grid>
            )}

            {/* History Dialog */}
            <CertificateHistoryDialog
              open={showHistoryDialog}
              onClose={handleCloseHistory}
              renewals={renewals}
              approvalHistory={approvalHistory}
            />
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default LegalCertificateEditPage;
