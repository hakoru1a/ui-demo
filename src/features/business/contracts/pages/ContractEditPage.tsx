import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import ContractForm from '../components/ContractForm';
import type { Contract, ContractFormData } from '../types';
import { CONTRACT_URLS } from '../types/constants';
import { contractDefaultValues, contractSchema } from '../validation';

// Mock data - TODO: Replace with API call
const getMockContract = (id: string): Contract | null => {
  const mockContracts: Contract[] = [
    {
      id: '1',
      code: 'HD001',
      type: 'buy',
      partnerType: 'supplier',
      partnerId: '1',
      partnerName: 'Nhà cung cấp A',
      productId: '1',
      productName: 'Gỗ keo',
      pricingMethod: 'fixed',
      unitPrice: 1000000,
      currency: 'VND',
      contractQuantity: 1000,
      effectiveDate: new Date('2024-01-01'),
      expiryDate: new Date('2024-12-31'),
      paymentTerms: '30days',
      status: 'draft',
      contractValue: 1000000000,
      notes: 'Hợp đồng mua gỗ keo'
    }
  ];
  return mockContracts.find((c) => c.id === id) || null;
};

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Contract): ContractFormData => ({
  code: entity.code,
  type: entity.type,
  partnerType: entity.partnerType,
  partnerId: entity.partnerId,
  productId: entity.productId || '',
  pricingMethod: entity.pricingMethod,
  unitPrice: entity.unitPrice,
  priceFormula: entity.priceFormula,
  currency: entity.currency,
  contractQuantity: entity.contractQuantity,
  effectiveDate: entity.effectiveDate,
  expiryDate: entity.expiryDate,
  paymentTerms: entity.paymentTerms,
  attachment: entity.attachment,
  status: entity.status,
  notes: entity.notes
});

// ==============================|| CONTRACT EDIT PAGE ||============================== //

const ContractEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<ContractFormData>(contractDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockContract(id);

        if (found) {
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy hợp đồng');
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
    async (values: ContractFormData) => {
      // Mock API call - simulate network delay
      console.warn('Updating contract:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật hợp đồng thành công! (Mock)');
      if (id) {
        navigate(CONTRACT_URLS.DETAIL(id));
      }
    },
    [navigate, id]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(CONTRACT_URLS.DETAIL(id));
    } else {
      navigate(CONTRACT_URLS.LIST);
    }
  }, [navigate, id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chỉnh sửa hợp đồng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chỉnh sửa hợp đồng">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(CONTRACT_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={contractSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa hợp đồng"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<CloseOutlined />} onClick={handleCancel} disabled={isSubmitting}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveOutlined />} disabled={isSubmitting || !dirty}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu hợp đồng'}
                </Button>
              </Stack>
            }
          >
            <Grid container spacing={3} sx={{ p: 1 }}>
              <Grid size={12}>
                <ContractForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default ContractEditPage;
