// ==============================|| EMPLOYEE FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { DEPARTMENT_OPTIONS, CONTRACT_TYPE_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import type { EmployeeFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface EmployeeFormProps {
  mode: FormMode;
}

// ==============================|| EMPLOYEE FORM ||============================== //

const EmployeeForm = ({ mode }: EmployeeFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<EmployeeFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof EmployeeFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã nhân sự - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã nhân sự"
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

      {/* Họ & Tên */}
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <TextField
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Họ & Tên"
          placeholder="Nhập họ và tên"
          fullWidth
          required
          error={!!getError('fullName')}
          helperText={getError('fullName')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Bộ phận */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="department"
          value={values.department}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Bộ phận"
          fullWidth
          required
          error={!!getError('department')}
          helperText={getError('department')}
          options={DEPARTMENT_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Chức danh */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="position"
          value={values.position}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Chức danh"
          placeholder="Nhập chức danh"
          fullWidth
          required
          error={!!getError('position')}
          helperText={getError('position')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Loại hợp đồng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="contractType"
          value={values.contractType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại hợp đồng"
          fullWidth
          required
          error={!!getError('contractType')}
          helperText={getError('contractType')}
          options={CONTRACT_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin hợp đồng */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          Thông tin hợp đồng
        </Typography>
      </Grid>

      {/* Ngày hiệu lực */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          value={values.effectiveDate ? dayjs(values.effectiveDate) : null}
          onChange={(value) => {
            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
            setFieldValue('effectiveDate', dateStr);
          }}
          label="Ngày hiệu lực"
          error={!!getError('effectiveDate')}
          helperText={getError('effectiveDate') || undefined}
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

      {/* Ngày hết hạn */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          value={values.expiryDate ? dayjs(values.expiryDate) : null}
          onChange={(value) => {
            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
            setFieldValue('expiryDate', dateStr);
          }}
          label="Ngày hết hạn"
          error={!!getError('expiryDate')}
          helperText={getError('expiryDate') || undefined}
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

export default EmployeeForm;
