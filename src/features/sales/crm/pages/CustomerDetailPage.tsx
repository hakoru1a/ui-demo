import { EditOutlined, ArrowLeftOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import { EXPORT_ORDER_URLS } from '../../export-orders/types/constants';
import CustomerForm from '../components/CustomerForm';
import type { Customer, CustomerFormData } from '../types';
import { CUSTOMER_URLS } from '../types/constants';
import { customerSchema, customerDefaultValues } from '../validation';

// Mock function to get customer by ID - TODO: Replace with API call
const getMockCustomerById = (id: string): Customer | null => {
  const mockCustomers: Customer[] = [
    {
      id: '1',
      code: 'KH001',
      companyName: 'Công ty ABC International',
      country: 'US',
      address: '123 Main Street, New York, NY 10001',
      taxCode: 'US123456789',
      contactPerson: 'John Doe',
      email: 'john.doe@abc.com',
      phone: '+1-212-555-1234',
      currency: 'USD',
      paymentTerms: 'TT',
      creditLimit: 100000,
      status: 'active'
    }
  ];
  return mockCustomers.find((c) => c.id === id) || null;
};

// ==============================|| CUSTOMER DETAIL PAGE ||============================== //

const CustomerDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load customer data
  useEffect(() => {
    if (id) {
      // Mock API call
      const mockCustomer = getMockCustomerById(id);
      setCustomer(mockCustomer);
      setIsLoading(false);
    }
  }, [id]);

  // Convert entity to form data
  const entityToFormData = (entity: Customer): CustomerFormData => {
    return {
      code: entity.code,
      companyName: entity.companyName,
      country: entity.country,
      address: entity.address,
      taxCode: entity.taxCode,
      contactPerson: entity.contactPerson,
      email: entity.email,
      phone: entity.phone,
      currency: entity.currency,
      paymentTerms: entity.paymentTerms,
      creditLimit: entity.creditLimit,
      status: entity.status,
      notes: entity.notes
    };
  };

  // Initial form values
  const initialValues: CustomerFormData = customer ? entityToFormData(customer) : customerDefaultValues;

  // Handle edit
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(CUSTOMER_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back
  const handleBack = useCallback(() => {
    navigate(CUSTOMER_URLS.LIST);
  }, [navigate]);

  // Handle view related orders
  const handleViewOrders = useCallback(() => {
    // Navigate to export orders list with customer filter
    navigate(EXPORT_ORDER_URLS.LIST + `?customerId=${id}`);
  }, [navigate, id]);

  if (isLoading) {
    return (
      <MainCard title="Chi tiết khách hàng">
        <div>Đang tải...</div>
      </MainCard>
    );
  }

  if (!customer) {
    return (
      <MainCard title="Chi tiết khách hàng">
        <div>Không tìm thấy khách hàng</div>
      </MainCard>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={customerSchema}
      onSubmit={() => {}}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize
    >
      <Form>
        <MainCard
          title="Chi tiết khách hàng"
          secondary={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
                Quay lại
              </Button>
              <Button variant="outlined" color="primary" startIcon={<UnorderedListOutlined />} onClick={handleViewOrders}>
                Xem đơn hàng liên quan
              </Button>
              <Button variant="contained" color="primary" startIcon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            </Stack>
          }
        >
          <Grid container spacing={3} sx={{ p: 1 }}>
            <Grid size={12}>
              <CustomerForm mode="view" />
            </Grid>
          </Grid>
        </MainCard>
      </Form>
    </Formik>
  );
};

export default CustomerDetailPage;
