import { EditOutlined, ArrowLeftOutlined, FilePdfOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Stack, Button, Box, Alert, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import ContractForm from '../components/ContractForm';
import type { Contract, ContractFormData } from '../types';
import { CONTRACT_URLS, STATUS_OPTIONS } from '../types/constants';
import { getLabelFromOptions } from '../utils';
import { contractDefaultValues } from '../validation';

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

// ==============================|| CONTRACT DETAIL PAGE ||============================== //

const ContractDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Contract | null>(null);
  const [initialValues, setInitialValues] = useState<ContractFormData>(contractDefaultValues);
  const [isPrinting, setIsPrinting] = useState(false);

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
          setData(found);
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

  // Handle edit navigation
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(CONTRACT_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(CONTRACT_URLS.LIST);
  }, [navigate]);

  // Handle activate contract (when status = draft)
  const handleActivate = useCallback(async () => {
    if (!id || !data || data.status !== 'draft') return;

    setIsPrinting(true);
    try {
      // TODO: Call API to activate contract
      // await contractService.activateContract(id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Kích hoạt hợp đồng thành công! (Mock)');
      // Refresh data
      window.location.reload();
    } catch (activateError) {
      console.error('Error activating contract:', activateError);
      alert('Có lỗi xảy ra khi kích hoạt hợp đồng');
    } finally {
      setIsPrinting(false);
    }
  }, [id, data]);

  // Handle print contract
  const handlePrint = useCallback(async () => {
    if (!id) return;

    setIsPrinting(true);
    try {
      // TODO: Call API to print contract
      // const result = await contractService.printContract(id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('In hợp đồng thành công! (Mock)');
      // TODO: Implement actual PDF download
    } catch (printError) {
      console.error('Error printing contract:', printError);
      alert('Có lỗi xảy ra khi in hợp đồng');
    } finally {
      setIsPrinting(false);
    }
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Chi tiết hợp đồng">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Chi tiết hợp đồng">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  const statusLabel = data ? getLabelFromOptions(data.status, STATUS_OPTIONS) : '';
  const canActivate = data?.status === 'draft';

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
              <span>{data?.code}</span>
              <Chip label={statusLabel} color={data?.status === 'active' ? 'success' : 'default'} size="small" />
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại danh sách
              </Button>
              <Button variant="outlined" color="info" startIcon={<FilePdfOutlined />} onClick={handlePrint} disabled={isPrinting}>
                {isPrinting ? 'Đang xử lý...' : 'In hợp đồng'}
              </Button>
              {canActivate && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleOutlined />}
                  onClick={handleActivate}
                  disabled={isPrinting}
                >
                  {isPrinting ? 'Đang xử lý...' : 'Kích hoạt hợp đồng'}
                </Button>
              )}
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <ContractForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default ContractDetailPage;
