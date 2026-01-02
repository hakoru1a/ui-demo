import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, StopOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import PriceTableForm from '../components/PriceTableForm';
import { getMockPriceTableById } from '../mock/priceTables';
import type { PriceTableFormData, PriceTable } from '../types';
import { PRICE_TABLE_URLS } from '../types/constants';
import { priceTableDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: PriceTable): PriceTableFormData => ({
  code: entity.code,
  name: entity.name,
  materialType: entity.materialType,
  basePrice: entity.basePrice,
  adjustmentFormula: entity.adjustmentFormula,
  effectiveFrom: entity.effectiveFrom,
  status: entity.status
});

// ==============================|| PRICE TABLE DETAIL PAGE ||============================== //

const PriceTableDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PriceTable | null>(null);
  const [initialValues, setInitialValues] = useState<PriceTableFormData>(priceTableDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = id ? getMockPriceTableById(id) : undefined;

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy bảng giá');
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
      navigate(PRICE_TABLE_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle delete (mock)
  const handleDelete = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bảng giá này?')) {
      // Mock delete
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Xóa bảng giá thành công! (Mock)');
      navigate(PRICE_TABLE_URLS.LIST);
    }
  }, [navigate]);

  // Handle disable (Ngưng áp dụng) - only when status is active
  const handleDisable = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn ngưng áp dụng bảng giá này?')) {
      // Mock disable
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Ngưng áp dụng bảng giá thành công! (Mock)');
      // Refresh data or navigate
      if (id) {
        navigate(PRICE_TABLE_URLS.DETAIL(id));
      }
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(PRICE_TABLE_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết bảng giá">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết bảng giá">
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
                label={data?.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
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
              {data?.status === 'active' && (
                <Button variant="outlined" color="warning" startIcon={<StopOutlined />} onClick={handleDisable}>
                  Ngưng áp dụng
                </Button>
              )}
              <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleDelete}>
                Xóa
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <PriceTableForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default PriceTableDetailPage;
