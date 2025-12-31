// ==============================|| FOREST AREA FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Chip, Box, Typography, Autocomplete } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import FieldComponents from 'components/fields';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';

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

  // Convert file/string to CustomFile array for dropzone
  const getFileArray = (file: string | File | undefined): CustomFile[] | null => {
    if (!file) return null;
    if (typeof file === 'string') {
      // If it's a URL string, create a mock file object
      return [
        {
          name: file.split('/').pop() || 'File',
          preview: file,
          size: 0,
          type: 'image/*'
        } as CustomFile
      ];
    }
    // If it's a File, convert to CustomFile with preview
    return [
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      }) as CustomFile
    ];
  };

  // Wrapper for setFieldValue to map 'files' to actual field name
  const createSetFieldValueWrapper = (fieldName: string) => (field: string, value: any) => {
    if (field === 'files') {
      // Extract the first file from the array
      const file = value && value.length > 0 ? value[0] : null;
      setFieldValue(fieldName, file);
    } else {
      setFieldValue(field, value);
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
          error={!!getError('ownershipType')}
          helperText={getError('ownershipType')}
          options={OWNERSHIP_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
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
                readOnly={isReadOnly}
                renderInput={(params) => (
                  <FieldComponents.Text
                    {...params}
                    label="Chủ sở hữu / Đối tác"
                    placeholder="Chọn đối tác"
                    error={!!getError('ownerId')}
                    helperText={getError('ownerId')}
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
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
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
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Tỉnh / Khu vực"
                  placeholder="Chọn tỉnh"
                  required
                  error={!!getError('province')}
                  helperText={getError('province')}
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
          error={!!getError('treeType')}
          helperText={getError('treeType')}
          options={TREE_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
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

      {/* Sản lượng TB/tháng (m³) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="averageMonthlyYield"
          value={values.averageMonthlyYield || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Sản lượng TB/tháng (m³)"
          placeholder="Nhập sản lượng"
          fullWidth
          error={!!getError('averageMonthlyYield')}
          helperText={getError('averageMonthlyYield')}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">m³</InputAdornment>,
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

      {/* Section: Thông tin chứng chỉ */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin chứng chỉ
        </Typography>
      </Grid>

      {/* Lat - Long */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="latLong"
          value={values.latLong || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Lat - Long"
          placeholder="Ví dụ: 12.345678, 108.123456"
          fullWidth
          required
          error={!!getError('latLong')}
          helperText={getError('latLong') || 'Thông tin để load ra bản đồ'}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Mã chứng chỉ FSC/PEFC */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="certificateCode"
          value={values.certificateCode || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Mã chứng chỉ FSC/PEFC"
          placeholder="Nhập mã chứng chỉ"
          fullWidth
          required
          error={!!getError('certificateCode')}
          helperText={getError('certificateCode')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Hình ảnh chứng chỉ */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Hình ảnh chứng chỉ
        </Typography>
      </Grid>

      {/* Hình ảnh chứng chỉ */}
      <Grid size={12}>
        <Field name="certificateImage">
          {({ field, meta }: FieldProps) => (
            <Box>
              {isReadOnly ? (
                <Box>
                  {values.certificateImage ? (
                    <Box
                      component="img"
                      src={
                        typeof values.certificateImage === 'string' ? values.certificateImage : URL.createObjectURL(values.certificateImage)
                      }
                      alt="Hình ảnh chứng chỉ"
                      sx={{
                        width: '100%',
                        maxHeight: 300,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        p: 3,
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        textAlign: 'center',
                        bgcolor: 'grey.50'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Chưa có hình ảnh
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <SingleFileUpload
                  file={getFileArray(values.certificateImage)}
                  setFieldValue={createSetFieldValueWrapper('certificateImage')}
                  error={!!(meta.touched && meta.error)}
                  accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
                  maxSize={10 * 1024 * 1024} // 10MB
                />
              )}
              {meta.touched && meta.error && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                  {meta.error}
                </Typography>
              )}
            </Box>
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

export default ForestAreaForm;
