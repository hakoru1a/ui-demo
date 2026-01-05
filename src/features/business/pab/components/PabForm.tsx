// ==============================|| PAB FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Typography, Autocomplete } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import FieldComponents from 'components/fields';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { PAB_STATUS_OPTIONS, PAB_UNIT_OPTIONS, CUSTOMER_OPTIONS, PRODUCT_OPTIONS } from '../types/constants';
import type { PabFormData } from '../types/index';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface PabFormProps {
  mode: FormMode;
}

// ==============================|| PAB FORM ||============================== //

const PabForm = ({ mode }: PabFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<PabFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof PabFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã PAB - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã PAB"
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

      {/* Khách hàng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="customerId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={CUSTOMER_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('customerId', value || '');
              }}
              options={CUSTOMER_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Khách hàng"
                  placeholder="Chọn khách hàng"
                  required
                  error={!!getError('customerId')}
                  helperText={getError('customerId')}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      readOnly: isReadOnly
                    }
                  }}
                />
              )}
              sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
            />
          )}
        </Field>
      </Grid>

      {/* Sản phẩm/Nguyên liệu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="productId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={PRODUCT_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('productId', value || '');
              }}
              options={PRODUCT_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Sản phẩm/Nguyên liệu"
                  placeholder="Chọn sản phẩm"
                  required
                  error={!!getError('productId')}
                  helperText={getError('productId')}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      readOnly: isReadOnly
                    }
                  }}
                />
              )}
              sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
            />
          )}
        </Field>
      </Grid>

      {/* Số lượng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="quantity"
          value={values.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số lượng"
          placeholder="Nhập số lượng"
          fullWidth
          required
          error={!!getError('quantity')}
          helperText={getError('quantity')}
          slotProps={{
            htmlInput: {
              min: 0,
              step: 0.01
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Đơn vị */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="unit"
          value={values.unit}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Đơn vị"
          fullWidth
          required
          error={!!getError('unit')}
          helperText={getError('unit')}
          options={PAB_UNIT_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày giao dự kiến */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="expectedDeliveryDate">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Ngày giao dự kiến"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('expectedDeliveryDate', newValue ? newValue.toDate() : null);
                }}
                error={!!(meta.touched && meta.error)}
                helperText={meta.touched && meta.error ? (typeof meta.error === 'string' ? meta.error : '') : ''}
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

      {/* Section: Thông tin chi phí và thời gian */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          Thông tin chi phí và thời gian
        </Typography>
      </Grid>

      {/* Chi phí ước tính */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="estimatedCost"
          value={values.estimatedCost}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Chi phí ước tính"
          placeholder="Nhập chi phí"
          fullWidth
          required
          error={!!getError('estimatedCost')}
          helperText={getError('estimatedCost')}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              step: 1000
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Thời gian thực hiện */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="estimatedTime"
          value={values.estimatedTime}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Thời gian thực hiện"
          placeholder="Nhập thời gian"
          fullWidth
          required
          error={!!getError('estimatedTime')}
          helperText={getError('estimatedTime')}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">Ngày</InputAdornment>,
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              step: 1
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Biên lợi nhuận (%) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="margin"
          value={values.margin || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Biên lợi nhuận (%)"
          placeholder="Nhập biên lợi nhuận"
          fullWidth
          error={!!getError('margin')}
          helperText={getError('margin') || 'Tham khảo'}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              max: 100,
              step: 0.1
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Trạng thái và ghi chú */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          Trạng thái và ghi chú
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
          options={PAB_STATUS_OPTIONS}
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
        <RichField
          name="notes"
          value={values.notes || ''}
          onChange={(e) => setFieldValue('notes', e.target.value)}
          label="Ghi chú"
          placeholder="Nhập ghi chú"
          fullWidth
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

export default PabForm;
