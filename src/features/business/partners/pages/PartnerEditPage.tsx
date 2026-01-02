import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import PartnerForm from '../components/PartnerForm';
import type { Partner, PartnerFormData } from '../types';
import { PARTNER_URLS } from '../types/constants';
import { partnerDefaultValues, partnerSchema } from '../validation';

// Mock data - TODO: Replace with API call
const getMockPartner = (id: string): Partner | null => {
  const mockPartners: Partner[] = [
    {
      id: '1',
      code: 'KH001',
      name: 'Công ty ABC',
      type: 'business',
      representative: 'Nguyễn Văn A',
      phone: '0912345678',
      address: '123 Đường XYZ, Quận 1, TP.HCM',
      status: 'active',
      notes: 'Khách hàng VIP'
    }
  ];
  return mockPartners.find((p) => p.id === id) || null;
};

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Partner): PartnerFormData => ({
  code: entity.code,
  name: entity.name,
  type: entity.type,
  representative: entity.representative,
  phone: entity.phone,
  address: entity.address,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| PARTNER EDIT PAGE ||============================== //

const PartnerEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<PartnerFormData>(partnerDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockPartner(id);

        if (found) {
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy khách hàng');
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
    async (values: PartnerFormData) => {
      // Mock API call - simulate network delay
      console.warn('Updating partner:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật khách hàng thành công! (Mock)');
      if (id) {
        navigate(PARTNER_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(PARTNER_URLS.DETAIL(id));
    } else {
      navigate(PARTNER_URLS.LIST);
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa khách hàng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa khách hàng">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(PARTNER_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={partnerSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa khách hàng"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <PartnerForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default PartnerEditPage;
