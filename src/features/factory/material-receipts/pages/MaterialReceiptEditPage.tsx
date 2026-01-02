import { SaveOutlined, CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import MaterialReceiptForm from '../components/MaterialReceiptForm';
import type { MaterialReceipt, MaterialReceiptFormData } from '../types';
import { MATERIAL_RECEIPT_URLS } from '../types/constants';
import { materialReceiptSchema, materialReceiptDefaultValues } from '../validation';

// ==============================|| MATERIAL RECEIPT EDIT PAGE ||============================== //

const MaterialReceiptEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<MaterialReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load receipt data
  useEffect(() => {
    const loadReceipt = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // TODO: Call API to get receipt
        // const response = await materialReceiptService.getMaterialReceiptById(id);
        // if (response.success) {
        //   setReceipt(response.data);
        // }

        // Mock: Load from mock data
        const mockReceipts = await import('../mock/materialReceipts').then((m) => m.getMockMaterialReceipts());
        const foundReceipt = mockReceipts.find((r) => r.id === id);
        if (foundReceipt) {
          setReceipt(foundReceipt);
        }
      } catch (error) {
        console.error('Error loading receipt:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReceipt();
  }, [id]);

  // Convert receipt to form data
  const getInitialValues = (): MaterialReceiptFormData => {
    if (!receipt) return materialReceiptDefaultValues;

    return {
      code: receipt.code,
      receiptDate: receipt.receiptDate,
      supplierId: receipt.supplierId,
      warehouseId: receipt.warehouseId,
      materialType: receipt.materialType,
      quantity: receipt.quantity,
      unitPrice: receipt.unitPrice,
      totalValue: receipt.totalValue,
      referenceDoc: receipt.referenceDoc,
      status: receipt.status,
      notes: receipt.notes
    };
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: MaterialReceiptFormData) => {
      if (!id) return;

      // TODO: Call API to update material receipt
      // const response = await materialReceiptService.updateMaterialReceipt(id, values);
      // if (response.success) {
      //   navigate(MATERIAL_RECEIPT_URLS.DETAIL(id));
      // }

      // Mock API call
      console.warn('Updating material receipt:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Cập nhật phiếu nhập kho thành công! (Mock)');
      navigate(MATERIAL_RECEIPT_URLS.DETAIL(id));
    },
    [id, navigate]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (id) {
      navigate(MATERIAL_RECEIPT_URLS.DETAIL(id));
    } else {
      navigate(MATERIAL_RECEIPT_URLS.LIST);
    }
  }, [id, navigate]);

  // Handle print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Handle confirm receipt (change status from draft to received)
  const handleConfirmReceipt = useCallback(async () => {
    if (!id) return;

    try {
      // TODO: Call API to confirm receipt
      // const response = await materialReceiptService.confirmReceipt(id);
      // if (response.success) {
      //   // Reload receipt data
      //   const updatedResponse = await materialReceiptService.getMaterialReceiptById(id);
      //   if (updatedResponse.success) {
      //     setReceipt(updatedResponse.data);
      //   }
      // }

      // Mock API call
      console.warn('Confirming receipt:', id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (receipt) {
        setReceipt({ ...receipt, status: 'received' });
        alert('Xác nhận nhập kho thành công! (Mock)');
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
    }
  }, [id, receipt]);

  if (isLoading) {
    return <MainCard title="Đang tải...">Đang tải dữ liệu phiếu nhập kho...</MainCard>;
  }

  if (!receipt) {
    return <MainCard title="Không tìm thấy">Không tìm thấy phiếu nhập kho với ID: {id}</MainCard>;
  }

  const initialValues = getInitialValues();
  const isDraft = receipt.status === 'draft';

  return (
    <Formik initialValues={initialValues} validationSchema={materialReceiptSchema} onSubmit={handleSubmit} validateOnChange validateOnBlur>
      {({ isSubmitting, dirty }) => (
        <Form>
          <MainCard
            title="Chỉnh sửa phiếu nhập kho"
            secondary={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" startIcon={<PrinterOutlined />} onClick={handlePrint}>
                  In phiếu
                </Button>
                {isDraft && (
                  <Button variant="contained" color="success" onClick={handleConfirmReceipt} disabled={isSubmitting}>
                    Xác nhận nhập kho
                  </Button>
                )}
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
                <MaterialReceiptForm mode="edit" />
              </Grid>
            </Grid>
          </MainCard>
        </Form>
      )}
    </Formik>
  );
};

export default MaterialReceiptEditPage;
