import { EditOutlined, ArrowLeftOutlined, HistoryOutlined, BarChartOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import { FOREST_AREA_URLS } from '../../forest-areas/types/constants';
import SupplierForm from '../components/SupplierForm';
import type { Supplier, SupplierFormData } from '../types';
import { SUPPLIER_URLS } from '../types/constants';
import { supplierDefaultValues } from '../validation';

// Mock data - TODO: Replace with API call
const getMockSupplier = (id: string): Supplier | null => {
  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      code: 'NCC001',
      name: 'Công ty Lâm sản ABC',
      type: 'business',
      representative: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'contact@abc.com',
      address: '123 Đường XYZ, Quận 1, TP.HCM',
      region: 'Đắk Lắk',
      status: 'active',
      certificates: ['FSC', 'PEFC'],
      averageMonthlyYield: 1500.5,
      notes: 'Nhà cung cấp uy tín'
    }
  ];
  return mockSuppliers.find((s) => s.id === id) || null;
};

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Supplier): SupplierFormData => ({
  code: entity.code,
  name: entity.name,
  type: entity.type,
  representative: entity.representative,
  phone: entity.phone,
  email: entity.email,
  address: entity.address,
  region: entity.region,
  status: entity.status,
  certificates: entity.certificates,
  idCardNumber: entity.idCardNumber,
  idCardIssueDate: entity.idCardIssueDate,
  idCardIssuePlace: entity.idCardIssuePlace,
  idCardImage: entity.idCardImage,
  landCertificateImage: entity.landCertificateImage,
  notes: entity.notes
});

// ==============================|| SUPPLIER DETAIL PAGE ||============================== //

const SupplierDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Supplier | null>(null);
  const [initialValues, setInitialValues] = useState<SupplierFormData>(supplierDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockSupplier(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy nhà cung cấp');
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
      navigate(SUPPLIER_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle view transaction history
  const handleViewTransactionHistory = useCallback(() => {
    if (id) {
      navigate(SUPPLIER_URLS.TRANSACTION_HISTORY(id));
    }
  }, [navigate, id]);

  // Handle view yield report
  const handleViewYieldReport = useCallback(() => {
    navigate(`/yield-estimation${id ? `?supplierId=${id}` : ''}`);
  }, [navigate, id]);

  // Handle view forest areas list
  const handleViewForestAreas = useCallback(() => {
    navigate(FOREST_AREA_URLS.LIST);
  }, [navigate]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(SUPPLIER_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết nhà cung cấp">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết nhà cung cấp">
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
              <span>{data?.name}</span>
              <Chip
                label={
                  data?.status === 'active'
                    ? 'Hoạt động'
                    : data?.status === 'pending'
                      ? 'Chờ duyệt'
                      : data?.status === 'rejected'
                        ? 'Từ chối'
                        : 'Tạm ngưng'
                }
                color={
                  data?.status === 'active'
                    ? 'success'
                    : data?.status === 'pending'
                      ? 'warning'
                      : data?.status === 'rejected'
                        ? 'error'
                        : 'default'
                }
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại danh sách
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<EnvironmentOutlined />} onClick={handleViewForestAreas}>
                Xem danh sách vùng trồng
              </Button>
              <Button variant="outlined" color="info" startIcon={<HistoryOutlined />} onClick={handleViewTransactionHistory}>
                Xem lịch sử giao dịch
              </Button>
              <Button variant="outlined" color="info" startIcon={<BarChartOutlined />} onClick={handleViewYieldReport}>
                Xem báo cáo sản lượng
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <SupplierForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default SupplierDetailPage;
