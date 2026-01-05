import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import EmployeeForm from '../components/EmployeeForm';
import { getMockEmployee } from '../mock/employees';
import type { Employee, EmployeeFormData } from '../types';
import { EMPLOYEE_URLS } from '../types/constants';
import { employeeDefaultValues, employeeSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Employee): EmployeeFormData => ({
  code: entity.code,
  fullName: entity.fullName,
  department: entity.department,
  position: entity.position,
  contractType: entity.contractType,
  effectiveDate: entity.effectiveDate,
  expiryDate: entity.expiryDate,
  status: entity.status
});

// ==============================|| EMPLOYEE DETAIL PAGE ||============================== //

const EmployeeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Employee | null>(null);
  const [initialValues, setInitialValues] = useState<EmployeeFormData>(employeeDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockEmployee(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy nhân sự');
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
      navigate(EMPLOYEE_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(EMPLOYEE_URLS.LIST);
  }, [navigate]);

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
          <div>{error || 'Không tìm thấy nhân sự'}</div>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Chi tiết nhân sự"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
          <Button variant="contained" startIcon={<EditOutlined />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        </Stack>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={employeeSchema}
        enableReinitialize
        onSubmit={() => {
          // No submit in view mode
        }}
      >
        <Form>
          <EmployeeForm mode="view" />
        </Form>
      </Formik>
    </MainCard>
  );
};

export default EmployeeDetailPage;
