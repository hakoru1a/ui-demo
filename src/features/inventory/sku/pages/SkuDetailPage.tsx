import { EditOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import SkuForm from '../components/SkuForm';
import { getMockSku } from '../mock/skus';
import type { Sku, SkuFormData } from '../types';
import { SKU_URLS, STOCK_STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../types/constants';
import { skuDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

// Helper function to convert entity to form data (exported for use in EditPage)
export const entityToFormData = (entity: Sku): SkuFormData => ({
  code: entity.code,
  name: entity.name,
  itemType: entity.itemType,
  warehouseId: entity.warehouseId,
  systemQuantity: entity.systemQuantity,
  reservedQuantity: entity.reservedQuantity,
  availableQuantity: entity.availableQuantity,
  lastInventoryDate: entity.lastInventoryDate,
  notes: entity.notes
});

// ==============================|| SKU DETAIL PAGE ||============================== //

const SkuDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Sku | null>(null);
  const [initialValues, setInitialValues] = useState<SkuFormData>(skuDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        // TODO: Replace with API call
        const found = getMockSku(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy SKU');
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
      navigate(SKU_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(SKU_URLS.LIST);
  }, [navigate]);

  // Handle create inventory check (navigate to SF-2-5 - stocktake)
  const handleCreateInventoryCheck = useCallback(() => {
    // TODO: Navigate to stocktake create page (SF-2-5)
    // For now, navigate to stocktakes list
    navigate('/stocktakes/new');
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Thông tin SKU & số lượng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Thông tin SKU & số lượng">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  const statusLabel = data ? getLabelFromOptions(data.stockStatus, STOCK_STATUS_OPTIONS) : '';
  const getStatusColor = (status?: Sku['stockStatus']) => {
    if (status === 'in_stock') return 'success';
    if (status === 'out_of_stock') return 'error';
    return 'default';
  };

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
              <span>
                {data?.code} - {data?.name}
              </span>
              <Chip label={statusLabel} color={getStatusColor(data?.stockStatus)} size="small" />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại danh sách
              </Button>
              <Button variant="contained" color="primary" startIcon={<FileTextOutlined />} onClick={handleCreateInventoryCheck}>
                Tạo phiếu kiểm kê
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <SkuForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default SkuDetailPage;
