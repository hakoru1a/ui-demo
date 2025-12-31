// ==============================|| SUPPLIER FORM COMPONENT ||============================== //

import { Grid, Chip, Box, Typography, Autocomplete } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import FieldComponents from 'components/fields';
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

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

      {/* Section: Thông tin CCCD/Passport */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin CCCD/Passport
        </Typography>
      </Grid>

      {/* Số CCCD/Passport */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="idCardNumber"
          value={values.idCardNumber || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số CCCD/Passport"
          placeholder="Nhập số CCCD/Passport"
          fullWidth
          required
          error={!!getError('idCardNumber')}
          helperText={getError('idCardNumber')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="idCardIssueDate">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Ngày cấp"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('idCardIssueDate', newValue ? newValue.toDate() : null);
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
            );
          }}
        </Field>
      </Grid>

      {/* Nơi cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="idCardIssuePlace"
          value={values.idCardIssuePlace || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Nơi cấp"
          placeholder="Nhập nơi cấp"
          fullWidth
          required
          error={!!getError('idCardIssuePlace')}
          helperText={getError('idCardIssuePlace')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Hình ảnh */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
          Hình ảnh
        </Typography>
      </Grid>

      {/* Hình CCCD */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="idCardImage">
          {({ field, meta }: FieldProps) => (
            <Box>
              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
                Hình CCCD <span style={{ color: 'red' }}>*</span>
              </Typography>
              {isReadOnly ? (
                <Box>
                  {values.idCardImage ? (
                    <Box
                      component="img"
                      src={typeof values.idCardImage === 'string' ? values.idCardImage : URL.createObjectURL(values.idCardImage)}
                      alt="Hình CCCD"
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
                  file={getFileArray(values.idCardImage)}
                  setFieldValue={createSetFieldValueWrapper('idCardImage')}
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

      {/* Hình ảnh sổ đỏ */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Field name="landCertificateImage">
          {({ field, meta }: FieldProps) => (
            <Box>
              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
                Hình ảnh sổ đỏ
              </Typography>
              {isReadOnly ? (
                <Box>
                  {values.landCertificateImage ? (
                    <Box
                      component="img"
                      src={
                        typeof values.landCertificateImage === 'string'
                          ? values.landCertificateImage
                          : URL.createObjectURL(values.landCertificateImage)
                      }
                      alt="Hình ảnh sổ đỏ"
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
                  file={getFileArray(values.landCertificateImage)}
                  setFieldValue={createSetFieldValueWrapper('landCertificateImage')}
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
