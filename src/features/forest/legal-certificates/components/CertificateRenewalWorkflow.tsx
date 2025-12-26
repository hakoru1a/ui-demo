// ==============================|| CERTIFICATE RENEWAL WORKFLOW COMPONENT ||============================== //

import { CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Alert
} from '@mui/material';
import dayjs, { type Dayjs } from 'dayjs';
import { Formik, Form, Field, FieldProps } from 'formik';
import { useState } from 'react';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import TextField from 'components/fields/TextField';

import type { CertificateRenewalFormData } from '../types';
import { certificateRenewalSchema, certificateRenewalDefaultValues } from '../validation';

// ==============================|| TYPES ||============================== //

interface CertificateRenewalWorkflowProps {
  certificateId: string;
  currentExpiryDate: Date | string;
  onComplete?: (renewalData: CertificateRenewalFormData) => void;
  onCancel?: () => void;
}

// ==============================|| RENEWAL WORKFLOW STEPS ||============================== //

const steps = [
  {
    label: 'Yêu cầu',
    description: 'Điền thông tin yêu cầu gia hạn',
    icon: <FileTextOutlined />
  },
  {
    label: 'Đang duyệt',
    description: 'Chờ phê duyệt từ ban quản lý',
    icon: <ClockCircleOutlined />
  },
  {
    label: 'Duyệt thành công',
    description: 'Yêu cầu đã được phê duyệt',
    icon: <CheckCircleOutlined />
  }
];

// ==============================|| CERTIFICATE RENEWAL WORKFLOW ||============================== //

const CertificateRenewalWorkflow = ({ certificateId, currentExpiryDate, onComplete, onCancel }: CertificateRenewalWorkflowProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<CertificateRenewalFormData | null>(null);

  // Handle step 1: Submit request
  const handleSubmitRequest = async (values: CertificateRenewalFormData) => {
    setFormData(values);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActiveStep(1);
  };

  // Handle step 2: Approve (mock - in real app this would be done by admin)
  const handleApprove = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setActiveStep(2);
    if (formData) {
      onComplete?.(formData);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Quy trình gia hạn chứng chỉ
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Request */}
          <Step completed={activeStep > 0} active={activeStep === 0}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: activeStep >= 0 ? 'primary.main' : 'grey.300',
                    color: activeStep >= 0 ? 'white' : 'grey.600'
                  }}
                >
                  {steps[0].icon}
                </Box>
              )}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {steps[0].label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {steps[0].description}
              </Typography>
            </StepLabel>
            <StepContent>
              {activeStep === 0 && (
                <Formik
                  initialValues={certificateRenewalDefaultValues}
                  validationSchema={certificateRenewalSchema}
                  onSubmit={handleSubmitRequest}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form>
                      <Stack spacing={3} sx={{ mt: 2 }}>
                        <Alert severity="info">Ngày hết hạn hiện tại: {new Date(currentExpiryDate).toLocaleDateString('vi-VN')}</Alert>

                        <Field name="newExpiryDate">
                          {({ field, meta }: FieldProps) => {
                            // Convert to dayjs for DatePicker
                            const dayjsValue = field.value
                              ? dayjs(field.value instanceof Date ? field.value : new Date(field.value))
                              : null;
                            return (
                              <DatePickerField
                                label="Ngày hết hạn mới"
                                value={dayjsValue}
                                onChange={(date: Dayjs | null) => {
                                  // Convert dayjs back to Date/string for form
                                  setFieldValue('newExpiryDate', date ? date.toDate() : null);
                                }}
                                error={!!(meta.touched && meta.error)}
                                helperText={meta.touched && meta.error ? meta.error : ''}
                                slotProps={{
                                  textField: {
                                    required: true,
                                    fullWidth: true
                                  }
                                }}
                              />
                            );
                          }}
                        </Field>

                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            File chứng chỉ mới (nếu có)
                          </Typography>
                          <input
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                            style={{ display: 'none' }}
                            id="renewal-certificate-file-upload"
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFieldValue('certificateFile', file);
                              }
                            }}
                          />
                          <label htmlFor="renewal-certificate-file-upload">
                            <Button variant="outlined" component="span" startIcon={<UploadOutlined />}>
                              Chọn file (PDF / Image)
                            </Button>
                          </label>
                          {values.certificateFile instanceof File && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {values.certificateFile.name}
                            </Typography>
                          )}
                        </Box>

                        <Field name="notes">
                          {({ field, meta }: FieldProps) => (
                            <TextField
                              {...field}
                              label="Ghi chú"
                              placeholder="Nhập ghi chú (nếu có)"
                              fullWidth
                              multiline
                              rows={3}
                              error={!!(meta.touched && meta.error)}
                              helperText={meta.touched && meta.error ? meta.error : ''}
                            />
                          )}
                        </Field>

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                          {onCancel && (
                            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                              Hủy
                            </Button>
                          )}
                          <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                          </Button>
                        </Stack>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              )}
              {activeStep > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.dark">
                    ✓ Yêu cầu đã được gửi thành công
                  </Typography>
                </Box>
              )}
            </StepContent>
          </Step>

          {/* Step 2: Under Review */}
          <Step completed={activeStep > 1} active={activeStep === 1}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: activeStep >= 1 ? 'warning.main' : 'grey.300',
                    color: activeStep >= 1 ? 'white' : 'grey.600'
                  }}
                >
                  {steps[1].icon}
                </Box>
              )}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {steps[1].label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {steps[1].description}
              </Typography>
            </StepLabel>
            <StepContent>
              {activeStep === 1 && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Yêu cầu đang được xem xét bởi ban quản lý
                  </Alert>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Vui lòng chờ phê duyệt...
                  </Typography>
                  {/* Mock: Auto approve after 2 seconds for demo */}
                  <Button variant="contained" color="success" onClick={handleApprove} sx={{ mt: 2 }}>
                    Phê duyệt (Mock - Admin)
                  </Button>
                </Box>
              )}
              {activeStep > 1 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.dark">
                    ✓ Đã được phê duyệt
                  </Typography>
                </Box>
              )}
            </StepContent>
          </Step>

          {/* Step 3: Approved */}
          <Step completed={activeStep === 2} active={activeStep === 2}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: activeStep >= 2 ? 'success.main' : 'grey.300',
                    color: activeStep >= 2 ? 'white' : 'grey.600'
                  }}
                >
                  {steps[2].icon}
                </Box>
              )}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {steps[2].label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {steps[2].description}
              </Typography>
            </StepLabel>
            <StepContent>
              {activeStep === 2 && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Gia hạn thành công!
                    </Typography>
                    <Typography variant="body2">
                      Chứng chỉ đã được gia hạn thành công. Ngày hết hạn mới:{' '}
                      {formData?.newExpiryDate ? new Date(formData.newExpiryDate).toLocaleDateString('vi-VN') : '-'}
                    </Typography>
                  </Alert>
                  <Chip label="Đã hoàn thành" color="success" sx={{ mt: 2 }} />
                </Box>
              )}
            </StepContent>
          </Step>
        </Stepper>
      </CardContent>
    </Card>
  );
};

export default CertificateRenewalWorkflow;
