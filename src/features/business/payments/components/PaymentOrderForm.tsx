// ==============================|| PAYMENT ORDER FORM COMPONENT ||============================== //

import { Grid, Typography, Box } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';

// project imports
import AutocompleteField from 'components/fields/AutocompleteField';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

// types
import {
  PAYMENT_ORDER_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  PARTNER_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  STATUS_OPTIONS
} from '../types/constants';
import type { PaymentOrderFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface PaymentOrderFormProps {
  mode: FormMode;
}

// Mock options - TODO: Replace with API calls
const PARTNER_OPTIONS = [
  { value: '1', label: 'Khách hàng A' },
  { value: '2', label: 'Khách hàng B' },
  { value: '3', label: 'Nhà cung cấp C' },
  { value: '4', label: 'Nhà cung cấp D' }
];

const CONTRACT_OPTIONS = [
  { value: '1', label: 'HD001 - Hợp đồng mua gỗ keo' },
  { value: '2', label: 'HD002 - Hợp đồng bán gỗ cao su' },
  { value: '3', label: 'HD003 - Hợp đồng mua nguyên liệu A' }
];

// ==============================|| PAYMENT ORDER FORM ||============================== //

const PaymentOrderForm = ({ mode }: PaymentOrderFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<PaymentOrderFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof PaymentOrderFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  // Convert file/string to CustomFile array for dropzone
  const getFileArray = (file: string | File | undefined): CustomFile[] | null => {
    if (!file) return null;
    if (typeof file === 'string') {
      // If it's a URL string, create a mock file object
      return [
        {
          name: file.split('/').pop() || 'File',
          preview: file,
          size: 0,
          type: 'application/pdf'
        } as CustomFile
      ];
    }
    // If it's a File, convert to CustomFile with preview
    return [
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      }) as CustomFile
    ];
  };

  // Wrapper for setFieldValue to map 'files' to actual field name
  const createSetFieldValueWrapper = (fieldName: string) => (field: string, value: unknown) => {
    if (field === 'files') {
      // Extract the first file from the array
      const file = Array.isArray(value) && value.length > 0 ? value[0] : null;
      setFieldValue(fieldName, file);
    } else {
      setFieldValue(field, value);
    }
  };

  // Filter partners based on partnerType
  const getPartnerOptions = () => {
    // In real implementation, filter by partnerType
    return PARTNER_OPTIONS;
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã PO - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã PO"
          placeholder="Tự động tạo"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          helperText={mode === 'create' ? 'Mã sẽ được tự động tạo khi lưu' : undefined}
        />
      </Grid>

      {/* Loại phiếu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại phiếu"
          fullWidth
          required
          error={!!getError('type')}
          helperText={getError('type')}
          options={PAYMENT_ORDER_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Đối tác */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="partnerType"
          value={values.partnerType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Đối tác"
          fullWidth
          required
          error={!!getError('partnerType')}
          helperText={getError('partnerType')}
          options={PARTNER_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Chọn đối tác - Autocomplete */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="partnerId">
          {({ field }: FieldProps) => {
            type PartnerOption = { value: string; label: string };
            return (
              <AutocompleteField
                {...field}
                value={getPartnerOptions().find((opt) => opt.value === field.value) || null}
                onChange={(_: React.SyntheticEvent, newValue: PartnerOption | null) => {
                  setFieldValue('partnerId', newValue?.value || '');
                }}
                options={getPartnerOptions()}
                getOptionLabel={(option: PartnerOption) => option.label}
                isOptionEqualToValue={(option: PartnerOption, val: PartnerOption) => option.value === val.value}
                readOnly={isReadOnly}
                label="Chọn đối tác"
                placeholder="Chọn đối tác"
                required
                error={!!getError('partnerId')}
                helperText={getError('partnerId') as string | undefined}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Hợp đồng liên quan - Optional */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="contractId">
          {({ field }: FieldProps) => {
            type ContractOption = { value: string; label: string };
            return (
              <AutocompleteField
                {...field}
                value={CONTRACT_OPTIONS.find((opt) => opt.value === field.value) || null}
                onChange={(_: React.SyntheticEvent, newValue: ContractOption | null) => {
                  setFieldValue('contractId', newValue?.value || '');
                }}
                options={CONTRACT_OPTIONS}
                getOptionLabel={(option: ContractOption) => option.label}
                isOptionEqualToValue={(option: ContractOption, val: ContractOption) => option.value === val.value}
                readOnly={isReadOnly}
                label="Hợp đồng liên quan"
                placeholder="Chọn hợp đồng (tùy chọn)"
                error={!!getError('contractId')}
                helperText={getError('contractId') as string | undefined}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Section: Thông tin thanh toán */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin thanh toán
        </Typography>
      </Grid>

      {/* Số tiền */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="paymentAmount"
          value={values.paymentAmount || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số tiền"
          placeholder="Nhập số tiền"
          fullWidth
          required
          error={!!getError('paymentAmount')}
          helperText={getError('paymentAmount')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0.01,
              step: 0.01
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Tiền tệ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="currency"
          value={values.currency}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tiền tệ"
          fullWidth
          required
          error={!!getError('currency')}
          helperText={getError('currency')}
          options={CURRENCY_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Phương thức */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="paymentMethod"
          value={values.paymentMethod}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Phương thức"
          fullWidth
          required
          error={!!getError('paymentMethod')}
          helperText={getError('paymentMethod')}
          options={PAYMENT_METHOD_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày thanh toán */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          name="paymentDate"
          value={dateHelper.normalizeDateValue(values.paymentDate)}
          onChange={(newValue) => {
            setFieldValue('paymentDate', newValue ? newValue.toDate() : null);
          }}
          label="Ngày thanh toán"
          error={!!getError('paymentDate')}
          helperText={getError('paymentDate') as string | undefined}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              readOnly: isReadOnly,
              size: 'medium'
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Nội dung chi */}
      <Grid size={12}>
        <TextField
          name="description"
          value={values.description || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Nội dung chi"
          placeholder="Nhập nội dung chi"
          fullWidth
          multiline
          rows={3}
          error={!!getError('description')}
          helperText={getError('description')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Chứng từ */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Chứng từ
        </Typography>
      </Grid>

      {/* File chứng từ - File Upload */}
      <Grid size={12}>
        <Field name="attachment">
          {({ field, meta }: FieldProps) => (
            <Box>
              {isReadOnly ? (
                <Box>
                  {values.attachment ? (
                    <Box
                      component="a"
                      href={typeof values.attachment === 'string' ? values.attachment : URL.createObjectURL(values.attachment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'inline-block',
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <Typography variant="body2">Xem chứng từ (Hóa đơn / UNC)</Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        p: 3,
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        textAlign: 'center',
                        bgcolor: 'grey.50'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Chưa có chứng từ
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <SingleFileUpload
                  file={getFileArray(values.attachment)}
                  setFieldValue={createSetFieldValueWrapper('attachment')}
                  error={!!(meta.touched && meta.error)}
                  accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] }}
                />
              )}
            </Box>
          )}
        </Field>
      </Grid>

      {/* Section: Trạng thái */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Trạng thái
        </Typography>
      </Grid>

      {/* Trạng thái */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="status"
          value={values.status}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Trạng thái"
          fullWidth
          required
          error={!!getError('status')}
          helperText={getError('status')}
          options={STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>
    </Grid>
  );
};

export default PaymentOrderForm;
