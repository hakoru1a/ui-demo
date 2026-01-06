// ==============================|| COMPLAINT FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { COMPLAINT_TYPE_OPTIONS, COMPLAINT_STATUS_OPTIONS, EMPLOYEE_OPTIONS } from '../types/constants';
import type { ComplaintFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface ComplaintFormProps {
  mode: FormMode;
}

// ==============================|| COMPLAINT FORM ||============================== //

const ComplaintForm = ({ mode }: ComplaintFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<ComplaintFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof ComplaintFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã khiếu nại */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Mã khiếu nại"
          placeholder="Nhập mã khiếu nại"
          fullWidth
          required
          error={!!getError('code')}
          helperText={getError('code')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Người gửi */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="sender"
          value={values.sender}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Người gửi"
          placeholder="Nhập tên người gửi"
          fullWidth
          required
          error={!!getError('sender')}
          helperText={getError('sender')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Nhân sự liên quan */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="relatedEmployeeId"
          value={values.relatedEmployeeId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Nhân sự liên quan"
          fullWidth
          error={!!getError('relatedEmployeeId')}
          helperText={getError('relatedEmployeeId')}
          options={[{ value: '', label: 'Không có' }, ...EMPLOYEE_OPTIONS]}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Loại khiếu nại */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại khiếu nại"
          fullWidth
          required
          error={!!getError('type')}
          helperText={getError('type')}
          options={COMPLAINT_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày tiếp nhận */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          label="Ngày tiếp nhận"
          value={values.receivedDate ? dayjs(values.receivedDate) : null}
          onChange={(value) => {
            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
            setFieldValue('receivedDate', dateStr);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: !!getError('receivedDate'),
              helperText: getError('receivedDate') || undefined,
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
          options={COMPLAINT_STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Mô tả */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          Mô tả chi tiết
        </Typography>
      </Grid>

      {/* Mô tả */}
      <Grid size={12}>
        <TextField
          name="description"
          value={values.description || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Mô tả"
          placeholder="Nhập mô tả chi tiết khiếu nại"
          fullWidth
          multiline
          rows={4}
          error={!!getError('description')}
          helperText={getError('description')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Giải pháp (chỉ hiển thị khi đã giải quyết hoặc đang xử lý) */}
      {(values.status === 'resolved' || values.status === 'processing') && (
        <>
          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
              Giải pháp / Xử lý
            </Typography>
          </Grid>

          {/* Giải pháp */}
          <Grid size={12}>
            <TextField
              name="resolution"
              value={values.resolution || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Giải pháp / Xử lý"
              placeholder="Nhập giải pháp hoặc cách xử lý"
              fullWidth
              multiline
              rows={4}
              error={!!getError('resolution')}
              helperText={getError('resolution')}
              slotProps={{
                input: {
                  readOnly: isReadOnly
                }
              }}
              sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ComplaintForm;
