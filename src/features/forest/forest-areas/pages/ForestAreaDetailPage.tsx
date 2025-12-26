import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert, Chip } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ForestAreaForm from '../components/ForestAreaForm';
import { mockForestAreas } from '../mock/forestAreas';
import type { ForestAreaFormData, ForestArea } from '../types';
import { FOREST_AREA_URLS } from '../types/constants';
import { forestAreaDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: ForestArea): ForestAreaFormData => ({
  code: entity.code,
  name: entity.name,
  ownershipType: entity.ownershipType,
  ownerId: entity.ownerId,
  area: entity.area,
  province: entity.province,
  treeType: entity.treeType,
  plantingYear: entity.plantingYear,
  status: entity.status,
  certificates: entity.certificates,
  notes: entity.notes
});

// ==============================|| FOREST AREA DETAIL PAGE ||============================== //

const ForestAreaDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ForestArea | null>(null);
  const [initialValues, setInitialValues] = useState<ForestAreaFormData>(forestAreaDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = mockForestAreas.find((item) => item.id === id);

      if (found) {
        setData(found);
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy vùng trồng');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle edit navigation
  const handleEdit = useCallback(() => {
    navigate(FOREST_AREA_URLS.EDIT(id!));
  }, [navigate, id]);

  // Handle delete (mock)
  const handleDelete = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vùng trồng này?')) {
      // Mock delete
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Xóa vùng trồng thành công! (Mock)');
      navigate(FOREST_AREA_URLS.LIST);
    }
  }, [navigate]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(FOREST_AREA_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết vùng trồng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết vùng trồng">
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
              <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleDelete}>
                Xóa
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Box sx={{ p: 1 }}>
            <ForestAreaForm mode="view" />
          </Box>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default ForestAreaDetailPage;
