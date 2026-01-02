import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import WeighTicketForm from '../components/WeighTicketForm';
import { mockWeighTickets } from '../mock/weighTickets';
import type { WeighTicketFormData, WeighTicket } from '../types';
import { WEIGH_TICKET_URLS } from '../types/constants';
import { weighTicketSchema, weighTicketDefaultValues } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: WeighTicket): WeighTicketFormData => ({
  code: entity.code,
  vehiclePlate: entity.vehiclePlate,
  supplierId: entity.supplierId,
  type: entity.type,
  weightIn: entity.weightIn,
  weightOut: entity.weightOut,
  weightDifference: entity.weightDifference,
  unitPrice: entity.unitPrice,
  estimatedAmount: entity.estimatedAmount,
  notes: entity.notes
});

// ==============================|| WEIGH TICKET EDIT PAGE ||============================== //

const WeighTicketEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<WeighTicketFormData>(weighTicketDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = mockWeighTickets.find((item) => item.id === id);

      if (found) {
        setInitialValues(entityToFormData(found));
      } else {
        setError('Không tìm thấy phiếu cân');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission (mock)
  const handleSubmit = useCallback(
    async (values: WeighTicketFormData) => {
      if (!id) return;

      // Mock API call - simulate network delay
      console.warn('Updating weigh ticket:', id, values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật phiếu cân thành công! (Mock)');
      navigate(WEIGH_TICKET_URLS.DETAIL(id));
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(WEIGH_TICKET_URLS.DETAIL(id));
    } else {
      navigate(WEIGH_TICKET_URLS.LIST);
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa phiếu cân">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa phiếu cân">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleCancel}>
          Quay lại
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={weighTicketSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa phiếu cân"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <WeighTicketForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default WeighTicketEditPage;
