// ==============================|| FOREST AREA FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Chip, Box, Typography, Autocomplete, TextField as MuiTextField } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';

import type { ForestAreaFormData } from '../types';
import {
  OWNERSHIP_TYPE_OPTIONS,
  TREE_TYPE_OPTIONS,
  STATUS_OPTIONS,
  CERTIFICATE_OPTIONS,
  PROVINCE_OPTIONS,
  PARTNER_OPTIONS
} from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface ForestAreaFormProps {
  mode: FormMode;
}

// ==============================|| FOREST AREA FORM ||============================== //

const ForestAreaForm = ({ mode }: ForestAreaFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<ForestAreaFormData>();

  const isReadOnly = mode === 'view';
  const ownershipType = values.ownershipType;

  const getError = (field: keyof ForestAreaFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã vùng trồng - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã vùng trồng"
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

      {/* Tên vùng trồng */}
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <TextField
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên vùng trồng"
          placeholder="Nhập tên vùng trồng"
          fullWidth
          required
          disabled={isReadOnly}
          error={!!getError('name')}
          helperText={getError('name')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
        />
      </Grid>

      {/* Loại sở hữu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="ownershipType"
          value={values.ownershipType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại sở hữu"
          fullWidth
          required
          disabled={isReadOnly}
          error={!!getError('ownershipType')}
          helperText={getError('ownershipType')}
          options={OWNERSHIP_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
        />
      </Grid>

      {/* Chủ sở hữu / Đối tác - Hiển thị khi ownershipType = 'partner' */}
      {ownershipType === 'partner' && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Field name="ownerId">
            {({ field }: FieldProps) => (
              <Autocomplete
                {...field}
                value={PARTNER_OPTIONS.find((opt) => opt.value === field.value) || null}
                onChange={(_, newValue) => {
                  const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                  setFieldValue('ownerId', value || '');
                }}
                options={PARTNER_OPTIONS}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, val) => option.value === val.value}
                disabled={isReadOnly}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Chủ sở hữu / Đối tác"
                    placeholder="Chọn đối tác"
                    error={!!getError('ownerId')}
                    helperText={getError('ownerId')}
                  />
                )}
              />
            )}
          </Field>
        </Grid>
      )}

      {/* Diện tích */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="area"
          value={values.area}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Diện tích"
          placeholder="Nhập diện tích"
          fullWidth
          required
          disabled={isReadOnly}
          error={!!getError('area')}
          helperText={getError('area')}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">ha</InputAdornment>,
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              step: 0.1
            }
          }}
        />
      </Grid>

      {/* Tỉnh / Khu vực */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="province">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={PROVINCE_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('province', value || '');
              }}
              options={PROVINCE_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              disabled={isReadOnly}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  label="Tỉnh / Khu vực"
                  placeholder="Chọn tỉnh"
                  required
                  error={!!getError('province')}
                  helperText={getError('province')}
                />
              )}
            />
          )}
        </Field>
      </Grid>

      {/* Section: Thông tin chi tiết */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin chi tiết
        </Typography>
      </Grid>

      {/* Loại cây trồng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="treeType"
          value={values.treeType || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại cây trồng"
          fullWidth
          disabled={isReadOnly}
          error={!!getError('treeType')}
          helperText={getError('treeType')}
          options={TREE_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
        />
      </Grid>

      {/* Năm trồng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="plantingYear"
          value={values.plantingYear || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Năm trồng"
          placeholder="Nhập năm trồng"
          fullWidth
          disabled={isReadOnly}
          error={!!getError('plantingYear')}
          helperText={getError('plantingYear')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 1900,
              max: new Date().getFullYear()
            }
          }}
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
          disabled={isReadOnly}
          error={!!getError('status')}
          helperText={getError('status')}
          options={STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
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
              disabled={isReadOnly}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option.label}
                      size="small"
                      color={option.value === 'FSC' ? 'success' : 'info'}
                      {...tagProps}
                      disabled={isReadOnly}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  label="Chứng chỉ"
                  placeholder="Chọn chứng chỉ"
                  error={!!getError('certificates')}
                  helperText={getError('certificates')}
                />
              )}
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
          disabled={isReadOnly}
          error={!!getError('notes')}
          helperText={getError('notes')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
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

export default ForestAreaForm;
