// ==============================|| LEGAL CERTIFICATE FORM COMPONENT ||============================== //

import { FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { Grid, Typography, Box, Button, Link } from '@mui/material';
import dayjs, { type Dayjs } from 'dayjs';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';

import type { LegalCertificateFormData } from '../types';
import { CERTIFICATE_TYPE_OPTIONS } from '../types';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface LegalCertificateFormProps {
  mode: FormMode;
}

// ==============================|| LEGAL CERTIFICATE FORM ||============================== //

const LegalCertificateForm = ({ mode }: LegalCertificateFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<LegalCertificateFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof LegalCertificateFormData) => touched[field] && errors[field];

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue('certificateFile', file);
    }
  };

  // Get file name
  const getFileName = () => {
    if (values.certificateFile instanceof File) {
      return values.certificateFile.name;
    }
    if (typeof values.certificateFile === 'string' && values.certificateFile) {
      // Extract filename from URL
      return values.certificateFile.split('/').pop() || 'File đã tải lên';
    }
    return null;
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin chứng chỉ */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin chứng chỉ
        </Typography>
      </Grid>

      {/* Loại chứng chỉ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="certificateType"
          value={values.certificateType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại chứng chỉ"
          fullWidth
          required
          error={!!getError('certificateType')}
          helperText={getError('certificateType')}
          options={CERTIFICATE_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Số chứng chỉ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="certificateNumber"
          value={values.certificateNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số chứng chỉ"
          placeholder="Nhập số chứng chỉ"
          fullWidth
          required
          error={!!getError('certificateNumber')}
          helperText={getError('certificateNumber')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Tổ chức cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="issuingOrganization"
          value={values.issuingOrganization}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tổ chức cấp"
          placeholder="Nhập tên tổ chức cấp"
          fullWidth
          required
          error={!!getError('issuingOrganization')}
          helperText={getError('issuingOrganization')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="issueDate">
          {({ field, meta }: FieldProps) => {
            // Convert to dayjs for DatePicker
            const dayjsValue = field.value ? dayjs(field.value instanceof Date ? field.value : new Date(field.value)) : null;
            return (
              <DatePickerField
                label="Ngày cấp"
                value={dayjsValue}
                onChange={(date: Dayjs | null) => {
                  // Convert dayjs back to Date/string for form
                  setFieldValue('issueDate', date ? date.toDate() : null);
                }}
                error={!!(meta.touched && meta.error)}
                helperText={meta.touched && meta.error ? meta.error : ''}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    inputProps: {
                      readOnly: isReadOnly
                    }
                  }
                }}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Ngày hết hạn */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="expiryDate">
          {({ field, meta }: FieldProps) => {
            // Convert to dayjs for DatePicker
            const dayjsValue = field.value ? dayjs(field.value instanceof Date ? field.value : new Date(field.value)) : null;
            return (
              <DatePickerField
                label="Ngày hết hạn"
                value={dayjsValue}
                onChange={(date: Dayjs | null) => {
                  // Convert dayjs back to Date/string for form
                  setFieldValue('expiryDate', date ? date.toDate() : null);
                }}
                error={!!(meta.touched && meta.error)}
                helperText={meta.touched && meta.error ? meta.error : ''}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    inputProps: {
                      readOnly: isReadOnly
                    }
                  }
                }}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* File chứng chỉ */}
      <Grid size={12}>
        <Field name="certificateFile">
          {({ field, meta }: FieldProps) => (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                File chứng chỉ <span style={{ color: 'red' }}>*</span>
              </Typography>
              {isReadOnly ? (
                <Box>
                  {getFileName() ? (
                    <Link
                      href={typeof values.certificateFile === 'string' ? values.certificateFile : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <FileTextOutlined />
                      {getFileName()}
                    </Link>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có file
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box>
                  <input
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    style={{ display: 'none' }}
                    id="certificate-file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="certificate-file-upload">
                    <Button variant="outlined" component="span" startIcon={<UploadOutlined />} sx={{ mb: 1 }}>
                      Chọn file (PDF / Image)
                    </Button>
                  </label>
                  {getFileName() && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileTextOutlined />
                      <Typography variant="body2">{getFileName()}</Typography>
                    </Box>
                  )}
                  {meta.touched && meta.error && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                      {meta.error}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Định dạng: PDF, JPG, PNG, GIF, WEBP. Tối đa 10MB
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Field>
      </Grid>

      {/* Ghi chú pháp lý */}
      <Grid size={12}>
        <TextField
          name="legalNotes"
          value={values.legalNotes || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Ghi chú pháp lý"
          placeholder="Nhập ghi chú pháp lý"
          fullWidth
          multiline
          rows={3}
          error={!!getError('legalNotes')}
          helperText={getError('legalNotes')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* View mode: Hiển thị thông tin thời gian */}
      {mode === 'view' && (
        <Grid size={12}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Thông tin hệ thống
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Ngày tạo: <strong>--</strong>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Cập nhật lần cuối: <strong>--</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default LegalCertificateForm;
