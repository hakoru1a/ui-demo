// ==============================|| TIMEKEEPING FORM COMPONENT ||============================== //

import { Autocomplete, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Field, FieldProps, useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import type { WorkShiftFormData } from '../types/form';
import { TIMEKEEPING_STATUS_OPTIONS, WORK_SHIFT_TYPE_OPTIONS } from '../types/index';

// Mock employee data - TODO: Replace with API call
const MOCK_EMPLOYEES = [
  { id: 'emp-1', code: 'NV001', name: 'Nguyễn Văn A' },
  { id: 'emp-2', code: 'NV002', name: 'Trần Thị B' },
  { id: 'emp-3', code: 'NV003', name: 'Lê Văn C' },
  { id: 'emp-4', code: 'NV004', name: 'Phạm Văn D' },
  { id: 'emp-5', code: 'NV005', name: 'Hoàng Thị E' }
];

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface TimekeepingFormProps {
  mode: FormMode;
}

// ==============================|| TIMEKEEPING FORM ||============================== //

const TimekeepingForm = ({ mode }: TimekeepingFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<WorkShiftFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof WorkShiftFormData) => touched[field] && errors[field];

  // Handle employee selection
  const handleEmployeeChange = (employeeId: string) => {
    const employee = MOCK_EMPLOYEES.find((emp) => emp.id === employeeId);
    if (employee) {
      setFieldValue('employeeId', employee.id);
      setFieldValue('employeeCode', employee.code);
      setFieldValue('employeeName', employee.name);
    }
  };

  // Get employee options
  const employeeOptions = MOCK_EMPLOYEES.map((emp) => ({
    value: emp.id,
    label: `${emp.code} - ${emp.name}`
  }));

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin chấm công
        </Typography>
      </Grid>

      {/* Nhân viên */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="employeeId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={employeeOptions.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                if (value) {
                  handleEmployeeChange(value);
                }
              }}
              options={employeeOptions}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nhân viên"
                  placeholder="Chọn nhân viên"
                  required
                  error={!!getError('employeeId')}
                  helperText={getError('employeeId')}
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

      {/* Mã nhân viên - Auto-filled, read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="employeeCode"
          value={values.employeeCode}
          label="Mã nhân viên"
          placeholder="Tự động điền"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
      </Grid>

      {/* Tên nhân viên - Auto-filled, read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="employeeName"
          value={values.employeeName}
          label="Tên nhân viên"
          placeholder="Tự động điền"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
      </Grid>

      {/* Ngày làm việc */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          value={values.workDate ? dayjs(values.workDate) : null}
          onChange={(value) => {
            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
            setFieldValue('workDate', dateStr);
          }}
          label="Ngày làm việc"
          error={!!getError('workDate')}
          helperText={getError('workDate') || undefined}
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
      </Grid>

      {/* Loại ca */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="shiftType"
          value={values.shiftType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại ca"
          fullWidth
          required
          error={!!getError('shiftType')}
          helperText={getError('shiftType')}
          options={WORK_SHIFT_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
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
          options={TIMEKEEPING_STATUS_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Thời gian bắt đầu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="startTime"
          value={
            typeof values.startTime === 'string'
              ? values.startTime.includes('T')
                ? values.startTime.split('T')[1]?.substring(0, 5) || ''
                : values.startTime
              : dateHelper.formatDateTime(new Date(values.startTime), 'HH:mm')
          }
          onChange={(e) => {
            const timeValue = e.target.value;
            // Convert to full datetime string for form
            const workDate = values.workDate ? new Date(values.workDate) : new Date();
            const [hours, minutes] = timeValue.split(':');
            workDate.setHours(parseInt(hours || '0', 10), parseInt(minutes || '0', 10), 0, 0);
            setFieldValue('startTime', workDate.toISOString());
          }}
          onBlur={handleBlur}
          label="Thời gian bắt đầu"
          fullWidth
          required
          type="time"
          error={!!getError('startTime')}
          helperText={getError('startTime')}
          slotProps={{
            input: {
              readOnly: isReadOnly,
              step: 300 // 5 minutes
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Thời gian kết thúc */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="endTime"
          value={
            typeof values.endTime === 'string'
              ? values.endTime.includes('T')
                ? values.endTime.split('T')[1]?.substring(0, 5) || ''
                : values.endTime
              : dateHelper.formatDateTime(new Date(values.endTime), 'HH:mm')
          }
          onChange={(e) => {
            const timeValue = e.target.value;
            // Convert to full datetime string for form
            const workDate = values.workDate ? new Date(values.workDate) : new Date();
            const [hours, minutes] = timeValue.split(':');
            workDate.setHours(parseInt(hours || '0', 10), parseInt(minutes || '0', 10), 0, 0);
            setFieldValue('endTime', workDate.toISOString());
          }}
          onBlur={handleBlur}
          label="Thời gian kết thúc"
          fullWidth
          required
          type="time"
          error={!!getError('endTime')}
          helperText={getError('endTime')}
          slotProps={{
            input: {
              readOnly: isReadOnly,
              step: 300 // 5 minutes
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
          fullWidth
          multiline
          rows={3}
          placeholder="Nhập ghi chú (nếu có)"
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

export default TimekeepingForm;
