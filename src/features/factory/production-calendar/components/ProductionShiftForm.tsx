// ==============================|| PRODUCTION SHIFT FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { getMockBatches } from '../../batches/mock/batches';
import { PRODUCTION_LINE_OPTIONS } from '../../production-plans/types/constants';
import type { ProductionShiftFormData } from '../types';
import { SHIFT_STATUS_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface ProductionShiftFormProps {
  mode: FormMode;
}

// ==============================|| PRODUCTION SHIFT FORM ||============================== //

const ProductionShiftForm = ({ mode }: ProductionShiftFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<ProductionShiftFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof ProductionShiftFormData) => touched[field] && errors[field];

  // Get batch options
  const batchOptions = getMockBatches().map((batch) => ({
    value: batch.id,
    label: `${batch.code} - ${batch.productName}`
  }));

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Lô sản xuất */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="batchId"
          value={values.batchId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Lô sản xuất"
          fullWidth
          required
          error={!!getError('batchId')}
          helperText={getError('batchId')}
          options={batchOptions}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Dây chuyền */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="productionLineId"
          value={values.productionLineId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Dây chuyền"
          fullWidth
          required
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
          options={SHIFT_STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thời gian ca */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thời gian ca
        </Typography>
      </Grid>

      {/* Thời gian bắt đầu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="startTime">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Thời gian bắt đầu"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('startTime', newValue ? newValue.toDate() : null);
                  // Update endTime if it's before startTime
                  if (newValue && values.endTime) {
                    const endTime = dateHelper.normalizeDateValue(values.endTime);
                    if (endTime && endTime.isBefore(newValue)) {
                      setFieldValue('endTime', newValue.add(8, 'hour').toDate()); // Default 8 hours shift
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

      {/* Thời gian kết thúc */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="endTime">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Thời gian kết thúc"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('endTime', newValue ? newValue.toDate() : null);
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

export default ProductionShiftForm;
