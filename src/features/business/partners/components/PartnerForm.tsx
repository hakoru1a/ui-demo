// ==============================|| PARTNER FORM COMPONENT ||============================== //

import { Grid, Typography, Box } from '@mui/material';
import { useFormikContext } from 'formik';

// project imports
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';

import { PARTNER_TYPE_OPTIONS, STATUS_OPTIONS } from '../types/constants';
import type { PartnerFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface PartnerFormProps {
  mode: FormMode;
}

// ==============================|| PARTNER FORM ||============================== //

const PartnerForm = ({ mode }: PartnerFormProps) => {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<PartnerFormData>();

  const isReadOnly = mode === 'view';
  const partnerType = values.type;

  const getError = (field: keyof PartnerFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã khách hàng - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã khách hàng"
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

      {/* Tên khách hàng */}
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <TextField
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên khách hàng"
          placeholder="Nhập tên khách hàng"
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

      {/* Loại khách hàng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại khách hàng"
          fullWidth
          required
          error={!!getError('type')}
          helperText={getError('type')}
          options={PARTNER_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Người đại diện - Hiển thị khi type = 'business' */}
      {partnerType === 'business' && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            name="representative"
            value={values.representative || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Người đại diện"
            placeholder="Nhập tên người đại diện"
            fullWidth
            required
            error={!!getError('representative')}
            helperText={getError('representative')}
            slotProps={{
              input: {
                readOnly: isReadOnly
              }
            }}
            sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
          />
        </Grid>
      )}

      {/* Số điện thoại */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          label="SĐT"
          placeholder="Nhập số điện thoại"
          fullWidth
          required
          error={!!getError('phone')}
          helperText={getError('phone')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Địa chỉ */}
      <Grid size={12}>
        <TextField
          name="address"
          value={values.address || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          fullWidth
          multiline
          rows={2}
          error={!!getError('address')}
          helperText={getError('address')}
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
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
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
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default PartnerForm;
