// ==============================|| PAB APPROVAL PAGE ||============================== //

import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import HistoryOutlined from '@ant-design/icons/HistoryOutlined';
import { Stack, Button, Box, CircularProgress, Alert, Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';
import dateHelper from 'utils/dateHelper';

import PabApprovalPipeline from '../components/PabApprovalPipeline';
import { getMockPabs } from '../mock/pabs';
import { PAB_URLS, APPROVAL_LAYER_OPTIONS, APPROVAL_DECISION_OPTIONS } from '../types/constants';
import type { Pab, PabApprovalFormData } from '../types/index';
import { pabApprovalSchema, pabApprovalDefaultValues } from '../validation';

// ==============================|| PAB APPROVAL PAGE ||============================== //

const PabApprovalPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const approvalHistoryDialog = useBoolean(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pab, setPab] = useState<Pab | null>(null);
  const [initialValues, setInitialValues] = useState<PabApprovalFormData>({
    ...pabApprovalDefaultValues,
    pabCode: '',
    approverId: 'current-user-id', // TODO: Get from auth context
    approvalDate: new Date()
  });

  // Fetch data on mount (mock)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find mock data by ID
      const found = getMockPabs().find((item) => item.id === id);

      if (found) {
        setPab(found);
        setInitialValues({
          ...pabApprovalDefaultValues,
          pabCode: found.code,
          approverId: 'current-user-id',
          approvalDate: new Date()
        });
      } else {
        setError('Không tìm thấy PAB');
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: PabApprovalFormData) => {
      console.warn('Approving PAB:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If approved, navigate to transaction status page
      // If rejected, navigate back to detail page
      if (id) {
        if (values.decision === 'approved') {
          navigate(PAB_URLS.TRANSACTION(id));
        } else {
          navigate(PAB_URLS.DETAIL(id));
        }
      }
    },
    [navigate, id]
  );

  // Handle back
  const handleBack = useCallback(() => {
    navigate(PAB_URLS.LIST);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Phê duyệt PAB">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard title="Phê duyệt PAB">
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
      validationSchema={pabApprovalSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isSubmitting, values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
        const getError = (field: keyof PabApprovalFormData) => touched[field] && errors[field];
        const isRejected = values.decision === 'rejected';

        return (
          <Form>
            <MainCard
              title="Phê duyệt phương án kinh doanh"
              secondary={
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Quay lại
                  </Button>
                  <Button variant="outlined" color="info" startIcon={<HistoryOutlined />} onClick={approvalHistoryDialog.onTrue}>
                    Xem lịch sử duyệt
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color={isRejected ? 'error' : 'success'}
                    startIcon={isRejected ? <CloseOutlined /> : <CheckOutlined />}
                    disabled={isSubmitting}
                  >
                    {isRejected ? 'Từ chối' : 'Duyệt'}
                  </Button>
                </Stack>
              }
            >
              <Grid container spacing={3} sx={{ p: 1 }}>
                {/* PAB Code - Read-only */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField name="pabCode" value={values.pabCode} label="Mã PAB" fullWidth disabled />
                </Grid>

                {/* Approval Layer */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <SelectField
                    name="approvalLayer"
                    value={values.approvalLayer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Cấp duyệt"
                    fullWidth
                    required
                    error={!!getError('approvalLayer')}
                    helperText={getError('approvalLayer')}
                    options={APPROVAL_LAYER_OPTIONS}
                  />
                </Grid>

                {/* Approver */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField name="approverId" value="Người dùng hiện tại" label="Người duyệt" fullWidth disabled />
                </Grid>

                {/* Approval Decision */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <SelectField
                    name="decision"
                    value={values.decision}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Quyết định"
                    fullWidth
                    required
                    error={!!getError('decision')}
                    helperText={getError('decision')}
                    options={APPROVAL_DECISION_OPTIONS}
                  />
                </Grid>

                {/* Approval Date */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePickerField
                    label="Ngày duyệt"
                    value={dateHelper.normalizeDateValue(values.approvalDate)}
                    onChange={(newValue) => {
                      setFieldValue('approvalDate', newValue ? newValue.toDate() : null);
                    }}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        error: !!getError('approvalDate'),
                        helperText: getError('approvalDate')
                      }
                    }}
                  />
                </Grid>

                {/* Approval Pipeline UI */}
                {pab && (
                  <Grid size={12}>
                    <PabApprovalPipeline pab={pab} />
                  </Grid>
                )}

                {/* Comment - Required if rejected */}
                <Grid size={12}>
                  <RichField
                    name="comment"
                    value={values.comment || ''}
                    onChange={(value) => setFieldValue('comment', value)}
                    label="Ý kiến"
                    placeholder={isRejected ? 'Nhập lý do từ chối (bắt buộc)' : 'Nhập ý kiến (tùy chọn)'}
                    fullWidth
                    required={isRejected}
                    error={!!getError('comment')}
                    helperText={getError('comment') || (isRejected ? 'Bắt buộc khi từ chối' : '')}
                  />
                </Grid>
              </Grid>
            </MainCard>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PabApprovalPage;
