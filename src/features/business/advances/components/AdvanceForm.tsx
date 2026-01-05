// ==============================|| ADVANCE FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

// types
import { REQUESTER_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import type { AdvanceFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface AdvanceFormProps {
  mode: FormMode;
}

// ==============================|| ADVANCE FORM ||============================== //

const AdvanceForm = ({ mode }: AdvanceFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<AdvanceFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof AdvanceFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã tạm ứng - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã tạm ứng"
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

      {/* Người đề nghị */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="requesterId"
          value={values.requesterId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Người đề nghị"
          fullWidth
          required
          error={!!getError('requesterId')}
          helperText={getError('requesterId')}
          options={REQUESTER_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày đề nghị */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          label="Ngày đề nghị"
          value={values.requestedDate ? dateHelper.normalizeDateValue(values.requestedDate) : null}
          onChange={(newValue) => {
            setFieldValue('requestedDate', newValue ? newValue.toDate() : new Date());
          }}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: !!getError('requestedDate'),
              helperText: getError('requestedDate'),
              readOnly: isReadOnly
            }
          }}
        />
      </Grid>

      {/* Số tiền */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="requestedAmount"
          value={values.requestedAmount}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số tiền"
          fullWidth
          required
          error={!!getError('requestedAmount')}
          helperText={getError('requestedAmount')}
          format="currency"
          currency="VND"
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
          options={STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Mục đích */}
      <Grid size={12}>
        <RichField
          name="purpose"
          value={values.purpose}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Mục đích"
          fullWidth
          required
          error={!!getError('purpose')}
          helperText={getError('purpose')}
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

export default AdvanceForm;
