// ==============================|| SUPPLIER FORM COMPONENT ||============================== //

import { Grid, Chip, Box, Typography, Autocomplete } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import FieldComponents from 'components/fields';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';

import { SUPPLIER_TYPE_OPTIONS, STATUS_OPTIONS, CERTIFICATE_OPTIONS, REGION_OPTIONS } from '../types/constants';
import type { SupplierFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface SupplierFormProps {
  mode: FormMode;
}

// ==============================|| SUPPLIER FORM ||============================== //

const SupplierForm = ({ mode }: SupplierFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<SupplierFormData>();

  const isReadOnly = mode === 'view';
  const supplierType = values.type;

  const getError = (field: keyof SupplierFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã nhà cung cấp - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã nhà cung cấp"
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

      {/* Tên nhà cung cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <TextField
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên nhà cung cấp"
          placeholder="Nhập tên nhà cung cấp"
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

      {/* Loại nhà cung cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại nhà cung cấp"
          fullWidth
          required
          error={!!getError('type')}
          helperText={getError('type')}
          options={SUPPLIER_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Người đại diện - Hiển thị khi type = 'business' */}
      {supplierType === 'business' && (
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
          label="Số điện thoại"
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

      {/* Email */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="email"
          value={values.email || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Email"
          placeholder="Nhập email"
          fullWidth
          error={!!getError('email')}
          helperText={getError('email')}
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

      {/* Khu vực cung cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="region">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={REGION_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('region', value || '');
              }}
              options={REGION_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Khu vực cung cấp"
                  placeholder="Chọn khu vực"
                  required
                  error={!!getError('region')}
                  helperText={getError('region')}
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

      {/* Chứng chỉ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="certificates">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              multiple
              value={CERTIFICATE_OPTIONS.filter((opt) => field.value?.includes(opt.value))}
              onChange={(_, newValue) =>
                setFieldValue(
                  'certificates',
                  newValue.map((v) => v.value)
                )
              }
              options={CERTIFICATE_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip key={key} label={option.label} size="small" color={option.value === 'FSC' ? 'success' : 'info'} {...tagProps} />
                  );
                })
              }
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Chứng chỉ"
                  placeholder="Chọn chứng chỉ"
                  error={!!getError('certificates')}
                  helperText={getError('certificates')}
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

export default SupplierForm;
