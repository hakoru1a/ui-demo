import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ExportDocumentForm from '../components/ExportDocumentForm';
import type { ExportDocument, ExportDocumentFormData } from '../types';
import { EXPORT_DOCUMENT_URLS } from '../types/constants';
import { exportDocumentSchema, exportDocumentDefaultValues } from '../validation';

// Mock function to get document by ID - TODO: Replace with API call
const getMockDocumentById = (id: string): ExportDocument | null => {
  const mockDocuments: ExportDocument[] = [
    {
      id: '1',
      documentNo: 'INV-001',
      documentType: 'invoice',
      exportOrderId: '1',
      exportOrderNo: 'XK001',
      customerId: 'customer-001',
      customerName: 'Công ty ABC International',
      invoiceDate: new Date('2024-01-15'),
      currency: 'USD',
      totalAmount: 50000,
      status: 'draft'
    }
  ];
  return mockDocuments.find((d) => d.id === id) || null;
};

// ==============================|| EXPORT DOCUMENT EDIT PAGE ||============================== //

const ExportDocumentEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<ExportDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load document data
  useEffect(() => {
    if (id) {
      // Mock API call
      const mockDocument = getMockDocumentById(id);
      setDocument(mockDocument);
      setIsLoading(false);
    }
  }, [id]);

  // Convert entity to form data
  const entityToFormData = (entity: ExportDocument): ExportDocumentFormData => {
    return {
      documentNo: entity.documentNo,
      documentType: entity.documentType,
      exportOrderId: entity.exportOrderId,
      customerId: entity.customerId,
      customerName: entity.customerName,
      invoiceDate: entity.invoiceDate,
      currency: entity.currency,
      totalAmount: entity.totalAmount,
      packageCount: entity.packageCount,
      grossWeight: entity.grossWeight,
      netWeight: entity.netWeight,
      hsCode: entity.hsCode,
      attachment: entity.attachment,
      status: entity.status
    };
  };

  // Initial form values
  const initialValues: ExportDocumentFormData = document ? entityToFormData(document) : exportDocumentDefaultValues;

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: ExportDocumentFormData) => {
      if (!id) return;

      // Mock API call - simulate network delay
      console.warn('Updating export document:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật chứng từ thành công! (Mock)');
      navigate(EXPORT_DOCUMENT_URLS.DETAIL(id));
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(EXPORT_DOCUMENT_URLS.DETAIL(id));
    } else {
      navigate(EXPORT_DOCUMENT_URLS.LIST);
    }
  }, [navigate, id]);

  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa chứng từ">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!document) {
    return (
      <MainCard title="Chỉnh sửa chứng từ">
        <div>Không tìm thấy chứng từ</div>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={exportDocumentSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa chứng từ"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu chứng từ'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <ExportDocumentForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default ExportDocumentEditPage;
