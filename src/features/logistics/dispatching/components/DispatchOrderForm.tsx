// ==============================|| DISPATCH ORDER FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Typography, Autocomplete } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import FieldComponents from 'components/fields';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { getMockVehicles } from '../../fleet/mock/vehicles';
import type { DispatchOrderFormData } from '../types';
import { DISPATCH_ORDER_STATUS_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface DispatchOrderFormProps {
  mode: FormMode;
}

// ==============================|| DISPATCH ORDER FORM ||============================== //

const DispatchOrderForm = ({ mode }: DispatchOrderFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<DispatchOrderFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof DispatchOrderFormData) => touched[field] && errors[field];

  // Get available vehicles (only ready status)
  const availableVehicles = getMockVehicles().filter((v) => v.vehicleStatus === 'ready');

  // Get vehicle options for dropdown
  const vehicleOptions = availableVehicles.map((v) => ({
    value: v.id,
    label: `${v.licensePlate} - ${v.driverName}`
  }));

  // Handle vehicle change - sync driver name
  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = availableVehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setFieldValue('vehicleId', vehicleId);
      setFieldValue('driverName', vehicle.driverName);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã lệnh - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="orderCode"
          value={values.orderCode}
          label="Mã lệnh"
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

      {/* Xe */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="vehicleId">
          {({ field, meta }: FieldProps) => (
            <Autocomplete
              {...field}
              value={vehicleOptions.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value || '' : newValue?.value || '';
                handleVehicleChange(value);
              }}
              options={vehicleOptions}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Xe"
                  placeholder="Chọn xe"
                  required
                  error={!!(meta.touched && meta.error)}
                  helperText={meta.touched && meta.error ? meta.error : ''}
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

      {/* Tài xế - Đồng bộ với xe */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="driverName"
          value={values.driverName}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tài xế"
          placeholder="Tự động đồng bộ với xe"
          fullWidth
          required
          error={!!getError('driverName')}
          helperText={getError('driverName') || 'Tự động đồng bộ với xe đã chọn'}
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Điểm xuất phát */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="origin"
          value={values.origin}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Điểm xuất phát"
          placeholder="Nhập điểm xuất phát"
          fullWidth
          required
          error={!!getError('origin')}
          helperText={getError('origin')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Điểm đến */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="destination"
          value={values.destination}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Điểm đến"
          placeholder="Nhập điểm đến"
          fullWidth
          required
          error={!!getError('destination')}
          helperText={getError('destination')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Thời gian xuất phát - DateTime */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="departureTime">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Thời gian xuất phát"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('departureTime', newValue ? newValue.toDate() : null);
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

      {/* Thời gian dự kiến (giờ) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="estimatedDuration"
          value={values.estimatedDuration || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Thời gian dự kiến"
          placeholder="Nhập thời gian dự kiến"
          fullWidth
          error={!!getError('estimatedDuration')}
          helperText={getError('estimatedDuration')}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">giờ</InputAdornment>,
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              step: 0.1
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
          options={DISPATCH_ORDER_STATUS_OPTIONS}
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

export default DispatchOrderForm;
