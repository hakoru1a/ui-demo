// ==============================|| VEHICLE FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Typography, Alert } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { VEHICLE_TYPE_OPTIONS, VEHICLE_STATUS_OPTIONS, DRIVER_STATUS_OPTIONS } from '../types/constants';
import type { VehicleFormData } from '../types/index';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface VehicleFormProps {
  mode: FormMode;
  isAssigned?: boolean; // Read-only khi đã gán lệnh
}

// ==============================|| VEHICLE FORM ||============================== //

const VehicleForm = ({ mode, isAssigned = false }: VehicleFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<VehicleFormData>();

  const isReadOnly = mode === 'view' || isAssigned;

  const getError = (field: keyof VehicleFormData) => touched[field] && errors[field];

  // Check if license is expired or expiring soon
  const isLicenseExpiring = () => {
    if (!values.driverLicenseExpiry) return false;
    const expiryDate = dateHelper.normalizeDateValue(values.driverLicenseExpiry);
    if (!expiryDate) return false;
    const today = dateHelper.getToday();
    const daysUntilExpiry = expiryDate.diff(today, 'day');
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isLicenseExpired = () => {
    if (!values.driverLicenseExpiry) return false;
    const expiryDate = dateHelper.normalizeDateValue(values.driverLicenseExpiry);
    if (!expiryDate) return false;
    const today = dateHelper.getToday();
    return expiryDate.isBefore(today);
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin xe */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin xe
        </Typography>
      </Grid>

      {/* Biển số xe */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="licensePlate"
          value={values.licensePlate}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Biển số xe"
          placeholder="Nhập biển số xe"
          fullWidth
          required
          error={!!getError('licensePlate')}
          helperText={getError('licensePlate')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Loại xe */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="vehicleType"
          value={values.vehicleType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại xe"
          fullWidth
          required
          error={!!getError('vehicleType')}
          helperText={getError('vehicleType')}
          options={VEHICLE_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Tải trọng tối đa (tấn) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="maxLoad"
          value={values.maxLoad}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tải trọng tối đa"
          placeholder="Nhập tải trọng"
          fullWidth
          required
          error={!!getError('maxLoad')}
          helperText={getError('maxLoad')}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">tấn</InputAdornment>,
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

      {/* Trạng thái xe */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="vehicleStatus"
          value={values.vehicleStatus}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Trạng thái xe"
          fullWidth
          required
          error={!!getError('vehicleStatus')}
          helperText={getError('vehicleStatus')}
          options={VEHICLE_STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin tài xế */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin tài xế
        </Typography>
      </Grid>

      {/* Tên tài xế */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="driverName"
          value={values.driverName}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên tài xế"
          placeholder="Nhập tên tài xế"
          fullWidth
          required
          error={!!getError('driverName')}
          helperText={getError('driverName')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Số điện thoại */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="driverPhone"
          value={values.driverPhone}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          fullWidth
          required
          error={!!getError('driverPhone')}
          helperText={getError('driverPhone')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Số GPLX */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="driverLicenseNumber"
          value={values.driverLicenseNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số GPLX"
          placeholder="Nhập số GPLX"
          fullWidth
          required
          error={!!getError('driverLicenseNumber')}
          helperText={getError('driverLicenseNumber')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày hết hạn GPLX */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="driverLicenseExpiry">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <>
                <DatePickerField
                  label="Ngày hết hạn GPLX"
                  value={dayjsValue}
                  onChange={(newValue) => {
                    setFieldValue('driverLicenseExpiry', newValue ? newValue.toDate() : null);
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
                {isLicenseExpired() && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    GPLX đã hết hạn!
                  </Alert>
                )}
                {isLicenseExpiring() && !isLicenseExpired() && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    GPLX sắp hết hạn trong vòng 30 ngày
                  </Alert>
                )}
              </>
            );
          }}
        </Field>
      </Grid>

      {/* Trạng thái tài xế */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="driverStatus"
          value={values.driverStatus}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Trạng thái tài xế"
          fullWidth
          required
          error={!!getError('driverStatus')}
          helperText={getError('driverStatus')}
          options={DRIVER_STATUS_OPTIONS}
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

      {/* View mode: Hiển thị thông tin thời gian */}
      {mode === 'view' && (
        <Grid size={12}>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Thông tin hệ thống
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default VehicleForm;
