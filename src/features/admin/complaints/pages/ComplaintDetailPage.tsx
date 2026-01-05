import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Stack, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import ComplaintForm from '../components/ComplaintForm';
import { getMockComplaint } from '../mock/complaints';
import { COMPLAINT_URLS } from '../types/constants';
import type { Complaint, ComplaintFormData } from '../types/index';
import { complaintDefaultValues, complaintSchema } from '../validation';

// ==============================|| HELPER: CONVERT ENTITY TO FORM DATA ||============================== //

const entityToFormData = (entity: Complaint): ComplaintFormData => ({
  code: entity.code,
  sender: entity.sender,
  relatedEmployeeId: entity.relatedEmployeeId,
  type: entity.type,
  receivedDate: entity.receivedDate,
  status: entity.status,
  description: entity.description,
  resolution: entity.resolution
});

// ==============================|| COMPLAINT DETAIL PAGE ||============================== //

const ComplaintDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Complaint | null>(null);
  const [initialValues, setInitialValues] = useState<ComplaintFormData>(complaintDefaultValues);

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockComplaint(id);

        if (found) {
          setData(found);
          setInitialValues(entityToFormData(found));
        } else {
          setError('Không tìm thấy khiếu nại');
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
      navigate(COMPLAINT_URLS.EDIT(id));
    }
  }, [navigate, id]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(COMPLAINT_URLS.LIST);
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
          <div>{error || 'Không tìm thấy khiếu nại'}</div>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Chi tiết khiếu nại"
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
        validationSchema={complaintSchema}
        enableReinitialize
        onSubmit={() => {
          // No submit in view mode
        }}
      >
        <Form>
          <ComplaintForm mode="view" />
        </Form>
      </Formik>
    </MainCard>
  );
};

export default ComplaintDetailPage;
