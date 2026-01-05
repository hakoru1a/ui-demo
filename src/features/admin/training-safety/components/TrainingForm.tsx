// ==============================|| TRAINING FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { TRAINING_TYPE_OPTIONS, TRAINING_STATUS_OPTIONS, DEPARTMENT_OPTIONS } from '../types/constants';
import type { TrainingFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface TrainingFormProps {
  mode: FormMode;
}

// ==============================|| TRAINING FORM ||============================== //

const TrainingForm = ({ mode }: TrainingFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<TrainingFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof TrainingFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Tên khóa đào tạo */}
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <TextField
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên khóa đào tạo"
          placeholder="Nhập tên khóa đào tạo"
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

      {/* Loại đào tạo */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại đào tạo"
          fullWidth
          required
          error={!!getError('type')}
          helperText={getError('type')}
          options={TRAINING_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Bộ phận tham gia */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="department"
          value={values.department}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Bộ phận tham gia"
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

      {/* Số người tham gia */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="participantCount"
          value={values.participantCount}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số người tham gia"
          placeholder="Nhập số người tham gia"
          fullWidth
          required
          error={!!getError('participantCount')}
          helperText={getError('participantCount')}
          slotProps={{
            input: {
              readOnly: isReadOnly,
              inputProps: {
                min: 0
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
          options={TRAINING_STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thời gian */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          Thời gian
        </Typography>
      </Grid>

      {/* Ngày bắt đầu */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <DatePickerField
          label="Ngày bắt đầu"
          value={values.startDate ? dayjs(values.startDate) : null}
          onChange={(value) => {
            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
            setFieldValue('startDate', dateStr);
          }}
          onBlur={handleBlur}
          fullWidth
          required
          error={!!getError('startDate')}
          helperText={getError('startDate')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày kết thúc */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <DatePickerField
          label="Ngày kết thúc"
          value={values.endDate ? dayjs(values.endDate) : null}
          onChange={(value) => {
            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
            setFieldValue('endDate', dateStr);
          }}
          onBlur={handleBlur}
          fullWidth
          required
          error={!!getError('endDate')}
          helperText={getError('endDate')}
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

export default TrainingForm;
