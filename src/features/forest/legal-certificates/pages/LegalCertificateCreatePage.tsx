import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import LegalCertificateForm from '../components/LegalCertificateForm';
import type { LegalCertificateFormData } from '../types';
import { LEGAL_CERTIFICATE_URLS } from '../types';
import { legalCertificateSchema, legalCertificateDefaultValues } from '../validation';

// ==============================|| LEGAL CERTIFICATE CREATE PAGE ||============================== //

const LegalCertificateCreatePage = () => {
  const navigate = useNavigate();

  // Initial form values
  const initialValues: LegalCertificateFormData = {
    ...legalCertificateDefaultValues
  };

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: LegalCertificateFormData) => {
      // Mock API call - simulate network delay
      console.warn('Creating legal certificate:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Generate a new ID and navigate to detail page
      const mockNewId = `cert-${Date.now()}`;
      alert('Tạo chứng chỉ thành công! (Mock)');
      navigate(LEGAL_CERTIFICATE_URLS.DETAIL(mockNewId));
    },
    [navigate]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate(LEGAL_CERTIFICATE_URLS.LIST);
  }, [navigate]);

  return (
    <Formik initialValues={initialValues} validationSchema={legalCertificateSchema} onSubmit={handleSubmit} validateOnChange validateOnBlur>
      {({ isSubmitting }) => (
        <Form>
          <MainCard
            title="Thêm chứng chỉ mới"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            <LegalCertificateForm mode="create" />
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default LegalCertificateCreatePage;
