import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import SupplierForm from '../components/SupplierForm';
import type { Supplier, SupplierFormData } from '../types';
import { SUPPLIER_URLS } from '../types/constants';
import { supplierSchema, supplierDefaultValues } from '../validation';

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
  notes: entity.notes
});

// ==============================|| SUPPLIER EDIT PAGE ||============================== //

const SupplierEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<Supplier | null>(null);
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
          setOriginalData(found);
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

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: SupplierFormData) => {
      if (!id) return;

      // Mock API call
      console.warn('Updating supplier:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật nhà cung cấp thành công! (Mock)');
      navigate(SUPPLIER_URLS.DETAIL(id));
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(SUPPLIER_URLS.DETAIL(id));
    } else {
      navigate(SUPPLIER_URLS.LIST);
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa nhà cung cấp">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa nhà cung cấp">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(SUPPLIER_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={supplierSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title={`Chỉnh sửa: ${originalData?.name || ''}`}
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <SupplierForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default SupplierEditPage;
