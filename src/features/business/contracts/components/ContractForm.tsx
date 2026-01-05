// ==============================|| CONTRACT FORM COMPONENT ||============================== //

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

import { CONTRACT_TYPE_OPTIONS, CURRENCY_OPTIONS, PARTNER_TYPE_OPTIONS, PRICING_METHOD_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import type { ContractFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface ContractFormProps {
  mode: FormMode;
}

// Mock options - TODO: Replace with API calls
const PARTNER_OPTIONS = [
  { value: '1', label: 'Nhà cung cấp A' },
  { value: '2', label: 'Nhà cung cấp B' },
  { value: '3', label: 'Khách hàng C' },
  { value: '4', label: 'Khách hàng D' }
];

const PRODUCT_OPTIONS = [
  { value: '1', label: 'Gỗ keo' },
  { value: '2', label: 'Gỗ cao su' },
  { value: '3', label: 'Nguyên liệu A' },
  { value: '4', label: 'Nguyên liệu B' }
];

const PAYMENT_TERMS_OPTIONS = [
  { value: 'cash', label: 'Tiền mặt' },
  { value: '30days', label: '30 ngày' },
  { value: '60days', label: '60 ngày' },
  { value: '90days', label: '90 ngày' }
];

// ==============================|| CONTRACT FORM ||============================== //

const ContractForm = ({ mode }: ContractFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<ContractFormData>();

  const isReadOnly = mode === 'view';
  const pricingMethod = values.pricingMethod;

  const getError = (field: keyof ContractFormData): string | undefined => {
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

      {/* Mã hợp đồng - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã hợp đồng"
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

      {/* Loại hợp đồng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại hợp đồng"
          fullWidth
          required
          error={!!getError('type')}
          helperText={getError('type')}
          options={CONTRACT_TYPE_OPTIONS}
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

      {/* Đối tác - Autocomplete */}
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

      {/* Sản phẩm/nguyên liệu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="productId">
          {({ field }: FieldProps) => {
            type ProductOption = { value: string; label: string };
            return (
              <AutocompleteField
                {...field}
                value={PRODUCT_OPTIONS.find((opt) => opt.value === field.value) || null}
                onChange={(_: React.SyntheticEvent, newValue: ProductOption | null) => {
                  setFieldValue('productId', newValue?.value || '');
                }}
                options={PRODUCT_OPTIONS}
                getOptionLabel={(option: ProductOption) => option.label}
                isOptionEqualToValue={(option: ProductOption, val: ProductOption) => option.value === val.value}
                readOnly={isReadOnly}
                label="Sản phẩm/nguyên liệu"
                placeholder="Chọn sản phẩm/nguyên liệu"
                required
                error={!!getError('productId')}
                helperText={getError('productId') as string | undefined}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Section: Thông tin giá */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin giá
        </Typography>
      </Grid>

      {/* Phương thức giá */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="pricingMethod"
          value={values.pricingMethod}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Phương thức giá"
          fullWidth
          required
          error={!!getError('pricingMethod')}
          helperText={getError('pricingMethod')}
          options={PRICING_METHOD_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Đơn giá - Conditional: Required if pricingMethod = 'fixed' */}
      {pricingMethod === 'fixed' && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <NumberField
            name="unitPrice"
            value={values.unitPrice || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Đơn giá"
            placeholder="Nhập đơn giá"
            fullWidth
            required
            error={!!getError('unitPrice')}
            helperText={getError('unitPrice')}
            slotProps={{
              input: {
                readOnly: isReadOnly
              },
              htmlInput: {
                min: 0,
                step: 0.01
              }
            }}
            sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
          />
        </Grid>
      )}

      {/* Công thức giá - Conditional: Only show when pricingMethod = 'formula' */}
      {pricingMethod === 'formula' && (
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <TextField
            name="priceFormula"
            value={values.priceFormula || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Công thức giá"
            placeholder="Nhập công thức giá"
            fullWidth
            required
            multiline
            rows={3}
            error={!!getError('priceFormula')}
            helperText={getError('priceFormula')}
            slotProps={{
              input: {
                readOnly: isReadOnly
              }
            }}
            sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
          />
        </Grid>
      )}

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

      {/* Sản lượng cam kết */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="contractQuantity"
          value={values.contractQuantity || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Sản lượng cam kết"
          placeholder="Nhập sản lượng"
          fullWidth
          error={!!getError('contractQuantity')}
          helperText={getError('contractQuantity')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              step: 0.01
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin thời gian */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin thời gian
        </Typography>
      </Grid>

      {/* Ngày hiệu lực */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          name="effectiveDate"
          value={dateHelper.normalizeDateValue(values.effectiveDate)}
          onChange={(newValue) => {
            setFieldValue('effectiveDate', newValue ? newValue.toDate() : null);
          }}
          label="Ngày hiệu lực"
          error={!!getError('effectiveDate')}
          helperText={getError('effectiveDate') as string | undefined}
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

      {/* Ngày hết hạn */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          name="expiryDate"
          value={dateHelper.normalizeDateValue(values.expiryDate)}
          onChange={(newValue) => {
            setFieldValue('expiryDate', newValue ? newValue.toDate() : null);
          }}
          label="Ngày hết hạn"
          error={!!getError('expiryDate')}
          helperText={getError('expiryDate') as string | undefined}
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

      {/* Section: Điều khoản & Tài liệu */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Điều khoản & Tài liệu
        </Typography>
      </Grid>

      {/* Điều khoản thanh toán */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="paymentTerms"
          value={values.paymentTerms || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Điều khoản thanh toán"
          fullWidth
          error={!!getError('paymentTerms')}
          helperText={getError('paymentTerms')}
          options={PAYMENT_TERMS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* File hợp đồng - File Upload */}
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
                      <Typography variant="body2">Xem file hợp đồng</Typography>
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
                        Chưa có file hợp đồng
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

      {/* Section: Trạng thái & Ghi chú */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Trạng thái & Ghi chú
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

      {/* Ghi chú */}
      <Grid size={12}>
        <TextField
          name="notes"
          value={values.notes || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Ghi chú"
          placeholder="Nhập ghi chú"
          fullWidth
          multiline
          rows={3}
          error={!!getError('notes')}
          helperText={getError('notes')}
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

export default ContractForm;
