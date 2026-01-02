// ==============================|| PRICE TABLE FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Typography } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { MATERIAL_TYPE_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import type { PriceTableFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface PriceTableFormProps {
  mode: FormMode;
}

// ==============================|| PRICE TABLE FORM ||============================== //

const PriceTableForm = ({ mode }: PriceTableFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<PriceTableFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof PriceTableFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã bảng giá - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã bảng giá"
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

      {/* Tên bảng giá */}
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <TextField
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên bảng giá"
          placeholder="Nhập tên bảng giá"
          fullWidth
          required
          error={!!getError('name')}
          helperText={getError('name')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Loại nguyên liệu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="materialType"
          value={values.materialType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại nguyên liệu"
          fullWidth
          required
          error={!!getError('materialType')}
          helperText={getError('materialType')}
          options={MATERIAL_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Đơn giá cơ bản (VNĐ/kg) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="basePrice"
          value={values.basePrice}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Đơn giá cơ bản"
          placeholder="Nhập đơn giá"
          fullWidth
          required
          error={!!getError('basePrice')}
          helperText={getError('basePrice')}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">VNĐ/kg</InputAdornment>,
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

      {/* Hiệu lực từ ngày */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="effectiveFrom">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Hiệu lực từ ngày"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('effectiveFrom', newValue ? newValue.toDate() : null);
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
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
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

      {/* Section: Công thức điều chỉnh */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Công thức điều chỉnh
        </Typography>
      </Grid>

      {/* Công thức điều chỉnh */}
      <Grid size={12}>
        <RichField
          name="adjustmentFormula"
          value={values.adjustmentFormula || ''}
          onChange={(value) => setFieldValue('adjustmentFormula', value)}
          label="Công thức điều chỉnh"
          placeholder="Mô tả logic công thức điều chỉnh giá..."
          fullWidth
          error={!!getError('adjustmentFormula')}
          helperText={getError('adjustmentFormula') || 'Mô tả logic công thức điều chỉnh giá'}
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
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
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
        </Grid>
      )}
    </Grid>
  );
};

export default PriceTableForm;
