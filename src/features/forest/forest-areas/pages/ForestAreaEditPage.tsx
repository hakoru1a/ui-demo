import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import ForestAreaForm from '../components/ForestAreaForm';
import ForestAreaSingleMapViewer from '../components/ForestAreaSingleMapViewer';
import { mockForestAreas } from '../mock/forestAreas';
import type { ForestAreaFormData, ForestArea } from '../types';
import { FOREST_AREA_URLS } from '../types/constants';
import { forestAreaSchema, forestAreaDefaultValues } from '../validation';

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

// ==============================|| FOREST AREA EDIT PAGE ||============================== //

const ForestAreaEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<ForestAreaFormData>(forestAreaDefaultValues);
  const [originalData, setOriginalData] = useState<ForestArea | null>(null);

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
        setOriginalData(found);
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

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: ForestAreaFormData) => {
      console.warn('Updating forest area:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật vùng trồng thành công! (Mock)');
      if (id) {
        navigate(FOREST_AREA_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(FOREST_AREA_URLS.DETAIL(id));
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa vùng trồng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa vùng trồng">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(FOREST_AREA_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forestAreaSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty, values }) => (
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
                <ForestAreaForm mode="edit" />
              </Grid>
              <Grid size={12}>
                <ForestAreaSingleMapViewer forestArea={originalData} formData={values} height={500} />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default ForestAreaEditPage;
