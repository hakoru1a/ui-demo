import { EditOutlined, ArrowLeftOutlined, FilePdfOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Stack, Button, Grid } from '@mui/material';
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

// ==============================|| EXPORT DOCUMENT DETAIL PAGE ||============================== //

const ExportDocumentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<ExportDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

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

  // Handle edit
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(EXPORT_DOCUMENT_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(EXPORT_DOCUMENT_URLS.LIST);
  }, [navigate]);

  // Handle issue document (Phát hành)
  const handleIssue = useCallback(async () => {
    if (!id || !document) return;

    if (document.status !== 'draft') {
      alert('Chỉ có thể phát hành chứng từ ở trạng thái Nháp');
      return;
    }

    setIsIssuing(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await exportDocumentService.issueDocument(id);
      alert('Phát hành chứng từ thành công! (Mock)');
      // Reload document
      const updatedDocument = { ...document, status: 'issued' as const };
      setDocument(updatedDocument);
    } catch (error) {
      console.error('Error issuing document:', error);
      alert('Có lỗi xảy ra khi phát hành chứng từ');
    } finally {
      setIsIssuing(false);
    }
  }, [id, document]);

  // Handle export PDF (In/Xuất PDF)
  const handleExportPDF = useCallback(async () => {
    if (!id) return;

    setIsExportingPDF(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // const result = await exportDocumentService.exportToPDF(id);
      // Create download link
      alert('Xuất PDF thành công! (Mock)');
      // TODO: Implement actual PDF download
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Có lỗi xảy ra khi xuất PDF');
    } finally {
      setIsExportingPDF(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <MainCard title="Chi tiết chứng từ">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!document) {
    return (
      <MainCard title="Chi tiết chứng từ">
        <div>Không tìm thấy chứng từ</div>
      </MainCard>
    );
  }

  const canIssue = document.status === 'draft';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={exportDocumentSchema}
      onSubmit={() => {}}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize
    >
      <Form>
        <MainCard
          title="Chi tiết chứng từ"
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button variant="outlined" color="info" startIcon={<FilePdfOutlined />} onClick={handleExportPDF} disabled={isExportingPDF}>
                {isExportingPDF ? 'Đang xuất...' : 'In / Xuất PDF'}
              </Button>
              {canIssue && (
                <Button variant="contained" color="success" startIcon={<CheckCircleOutlined />} onClick={handleIssue} disabled={isIssuing}>
                  {isIssuing ? 'Đang phát hành...' : 'Phát hành'}
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
              <ExportDocumentForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default ExportDocumentDetailPage;
