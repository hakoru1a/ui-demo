import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert, Chip } from '@mui/material';
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
import { partnerDefaultValues } from '../validation';

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

// ==============================|| PARTNER DETAIL PAGE ||============================== //

const PartnerDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Partner | null>(null);
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
          setData(found);
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

  // Handle edit navigation
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(PARTNER_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(PARTNER_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết khách hàng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết khách hàng">
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
                label={data?.status === 'active' ? 'Hoạt động' : 'Ngưng'}
                color={data?.status === 'active' ? 'success' : 'default'}
                size="small"
              />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <PartnerForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default PartnerDetailPage;
