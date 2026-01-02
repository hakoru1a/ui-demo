// ==============================|| PRODUCTION PLAN FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import type { ProductionPlanFormData } from '../types';
import { PLAN_TYPE_OPTIONS, PLAN_STATUS_OPTIONS, PRODUCT_OPTIONS, PRODUCTION_LINE_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface ProductionPlanFormProps {
  mode: FormMode;
}

// ==============================|| PRODUCTION PLAN FORM ||============================== //

const ProductionPlanForm = ({ mode }: ProductionPlanFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<ProductionPlanFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof ProductionPlanFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã kế hoạch/lệnh - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã kế hoạch / lệnh"
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

      {/* Loại */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại"
          fullWidth
          required
          error={!!getError('type')}
          helperText={getError('type')}
          options={PLAN_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Sản phẩm */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="productId"
          value={values.productId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Sản phẩm"
          fullWidth
          required
          error={!!getError('productId')}
          helperText={getError('productId')}
          options={PRODUCT_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Sản lượng dự kiến */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="plannedQuantity"
          value={values.plannedQuantity}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Sản lượng dự kiến"
          placeholder="Nhập sản lượng"
          fullWidth
          required
          error={!!getError('plannedQuantity')}
          helperText={getError('plannedQuantity')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 1,
              step: 1
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thời gian sản xuất */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thời gian sản xuất
        </Typography>
      </Grid>

      {/* Ngày bắt đầu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="startDate">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Ngày bắt đầu"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('startDate', newValue ? newValue.toDate() : null);
                  // Update endDate if it's before startDate
                  if (newValue && values.endDate) {
                    const endDate = dateHelper.normalizeDateValue(values.endDate);
                    if (endDate && endDate.isBefore(newValue)) {
                      setFieldValue('endDate', newValue.toDate());
                    }
                  }
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

      {/* Ngày kết thúc */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="endDate">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Ngày kết thúc"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('endDate', newValue ? newValue.toDate() : null);
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

      {/* Section: Thông tin bổ sung */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin bổ sung
        </Typography>
      </Grid>

      {/* Chi phí ước tính */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="estimatedCost"
          value={values.estimatedCost || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Chi phí ước tính"
          placeholder="Tự động tính"
          fullWidth
          error={!!getError('estimatedCost')}
          helperText={getError('estimatedCost') || 'Tự động tính toán'}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">đ</InputAdornment>,
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

      {/* Dây chuyền */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="productionLineId"
          value={values.productionLineId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Dây chuyền"
          fullWidth
          error={!!getError('productionLineId')}
          helperText={getError('productionLineId')}
          options={PRODUCTION_LINE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
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
          options={PLAN_STATUS_OPTIONS}
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
          placeholder="Nhập ghi chú..."
          fullWidth
          multiline
          rows={4}
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

export default ProductionPlanForm;
