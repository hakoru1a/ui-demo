import { EditOutlined, ArrowLeftOutlined, PrinterOutlined, CheckOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import WorkforceDispatchOrderForm from '../components/WorkforceDispatchOrderForm';
import { getMockWorkforceDispatchOrder } from '../mock/orders';
import type { WorkforceDispatchOrder, WorkforceDispatchOrderFormData } from '../types';
import { WORKFORCE_DISPATCH_URLS } from '../types/constants';
import { workforceDispatchOrderDefaultValues, workforceDispatchOrderSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: WorkforceDispatchOrder): WorkforceDispatchOrderFormData => ({
  code: entity.code,
  applicationDate: entity.applicationDate,
  factoryId: entity.factoryId,
  productionShiftId: entity.productionShiftId,
  departmentId: entity.departmentId,
  personnel: entity.personnel.map((p) => ({
    personnelId: p.personnelId,
    role: p.role,
    note: p.note
  })),
  status: entity.status
});

// ==============================|| WORKFORCE DISPATCH ORDER DETAIL PAGE ||============================== //

const WorkforceDispatchOrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WorkforceDispatchOrder | null>(null);
  const [initialValues, setInitialValues] = useState<WorkforceDispatchOrderFormData>(workforceDispatchOrderDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockWorkforceDispatchOrder(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy lệnh điều phối');
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
      navigate(WORKFORCE_DISPATCH_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(WORKFORCE_DISPATCH_URLS.LIST);
  }, [navigate]);

  // Handle submit for approval
  const handleSubmit = useCallback(async () => {
    if (!id) return;
    // TODO: Call API to submit order
    // await workforceDispatchOrderService.submitOrder(id);
    alert('Trình duyệt lệnh điều phối (Mock)');
  }, [id]);

  // Handle approve
  const handleApprove = useCallback(async () => {
    if (!id) return;
    // TODO: Call API to approve order
    // await workforceDispatchOrderService.approveOrder(id);
    alert('Phê duyệt lệnh điều phối (Mock)');
  }, [id]);

  // Handle cancel
  const handleCancel = useCallback(async () => {
    if (!id) return;
    // TODO: Call API to cancel order
    // await workforceDispatchOrderService.cancelOrder(id);
    alert('Hủy lệnh điều phối (Mock)');
  }, [id]);

  // Handle print
  const handlePrint = useCallback(async () => {
    if (!id) return;
    // TODO: Call API to print order
    // await workforceDispatchOrderService.printOrder(id);
    alert('In lệnh điều phối (Mock)');
  }, [id]);

  if (isLoading) {
    return (
      <MainCard>
        <CircularLoader />
      </MainCard>
    );
  }

  if (error || !data) {
    return (
      <MainCard>
        <Stack spacing={2}>
          <div>{error || 'Không tìm thấy lệnh điều phối'}</div>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      </MainCard>
    );
  }

  const canCancel = data.status !== 'applied'; // Chỉ có thể hủy khi chưa áp dụng
  const canEdit = data.status === 'draft'; // Chỉ có thể chỉnh sửa khi là draft

  return (
    <MainCard
      title="Chi tiết lệnh điều phối"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
          {canEdit && (
            <Button variant="contained" startIcon={<EditOutlined />} onClick={handleEdit}>
              Chỉnh sửa
            </Button>
          )}
          {data.status === 'draft' && (
            <Button variant="contained" color="primary" startIcon={<SendOutlined />} onClick={handleSubmit}>
              Trình duyệt
            </Button>
          )}
          {data.status === 'approved' && (
            <>
              <Button variant="contained" color="success" startIcon={<CheckOutlined />} onClick={handleApprove}>
                Phê duyệt
              </Button>
              {canCancel && (
                <Button variant="outlined" color="error" startIcon={<CloseOutlined />} onClick={handleCancel}>
                  Hủy lệnh
                </Button>
              )}
            </>
          )}
          <Button variant="outlined" startIcon={<PrinterOutlined />} onClick={handlePrint}>
            In lệnh
          </Button>
        </Stack>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={workforceDispatchOrderSchema}
        enableReinitialize
        onSubmit={() => {
          // No submit in view mode
        }}
      >
        <Form>
          <WorkforceDispatchOrderForm mode="view" />
        </Form>
      </Formik>
    </MainCard>
  );
};

export default WorkforceDispatchOrderDetailPage;
