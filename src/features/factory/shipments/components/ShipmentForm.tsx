// ==============================|| SHIPMENT FORM COMPONENT ||============================== //

import { Autocomplete, Box, Grid, InputAdornment, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';

// project imports
import FieldComponents from 'components/fields';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

import type { ShipmentFormData } from '../types';
import {
  BATCH_OPTIONS,
  CUSTOMER_OPTIONS,
  DESTINATION_PORT_OPTIONS,
  DESTINATION_TYPE_OPTIONS,
  DESTINATION_WAREHOUSE_OPTIONS,
  SHIPMENT_STATUS_OPTIONS,
  SHIPMENT_TYPE_OPTIONS,
  PRODUCT_OPTIONS,
  WAREHOUSE_OPTIONS
} from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface ShipmentFormProps {
  mode: FormMode;
}

// ==============================|| SHIPMENT FORM ||============================== //

const ShipmentForm = ({ mode }: ShipmentFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<ShipmentFormData>();

  const isReadOnly = mode === 'view';
  const destinationType = values.destinationType;

  const getError = (field: keyof ShipmentFormData) => touched[field] && errors[field];

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
          type: 'application/pdf'
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
  const createSetFieldValueWrapper = (fieldName: string) => (field: string, value: unknown) => {
    if (field === 'files') {
      // Extract the first file from the array
      const file = Array.isArray(value) && value.length > 0 ? value[0] : null;
      setFieldValue(fieldName, file);
    } else {
      setFieldValue(field, value);
    }
  };

  // Get destination options based on destination type
  const getDestinationOptions = () => {
    if (destinationType === 'warehouse') {
      return DESTINATION_WAREHOUSE_OPTIONS;
    } else if (destinationType === 'port') {
      return DESTINATION_PORT_OPTIONS;
    }
    return [];
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã phiếu xuất - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã phiếu xuất"
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

      {/* Ngày xuất */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="issueDate">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Ngày xuất"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('issueDate', newValue ? newValue.toDate() : new Date());
                }}
                error={!!(meta.touched && meta.error)}
                helperText={meta.touched && meta.error ? (typeof meta.error === 'string' ? meta.error : '') : ''}
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

      {/* Loại xuất */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="issueType"
          value={values.issueType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại xuất"
          fullWidth
          required
          error={!!getError('issueType')}
          helperText={getError('issueType')}
          options={SHIPMENT_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Kho xuất */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="warehouseId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={WAREHOUSE_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('warehouseId', value || '');
              }}
              options={WAREHOUSE_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Kho xuất"
                  placeholder="Chọn kho xuất"
                  required
                  error={!!getError('warehouseId')}
                  helperText={getError('warehouseId')}
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

      {/* Điểm nhận - Loại */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="destinationType"
          value={values.destinationType || ''}
          onChange={(e) => {
            handleChange(e);
            // Reset destinationId when type changes
            setFieldValue('destinationId', '');
          }}
          onBlur={handleBlur}
          label="Loại điểm nhận"
          fullWidth
          required
          error={!!getError('destinationType')}
          helperText={getError('destinationType')}
          options={DESTINATION_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Điểm nhận - Chi tiết */}
      {destinationType && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Field name="destinationId">
            {({ field }: FieldProps) => (
              <Autocomplete
                {...field}
                value={getDestinationOptions().find((opt) => opt.value === field.value) || null}
                onChange={(_, newValue) => {
                  const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                  setFieldValue('destinationId', value || '');
                }}
                options={getDestinationOptions()}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, val) => option.value === val.value}
                readOnly={isReadOnly}
                renderInput={(params) => (
                  <FieldComponents.Text
                    {...params}
                    label="Điểm nhận"
                    placeholder="Chọn điểm nhận"
                    required
                    error={!!getError('destinationId')}
                    helperText={getError('destinationId')}
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

      {/* Khách hàng / Đơn vị nhận */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="customerId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={CUSTOMER_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('customerId', value || undefined);
              }}
              options={CUSTOMER_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Khách hàng / Đơn vị nhận"
                  placeholder="Chọn khách hàng"
                  error={!!getError('customerId')}
                  helperText={getError('customerId')}
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

      {/* Section: Thông tin sản phẩm */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin sản phẩm
        </Typography>
      </Grid>

      {/* Sản phẩm / Nguyên liệu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="productId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={PRODUCT_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('productId', value || '');
              }}
              options={PRODUCT_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Sản phẩm / Nguyên liệu"
                  placeholder="Chọn sản phẩm"
                  required
                  error={!!getError('productId')}
                  helperText={getError('productId')}
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

      {/* Lô SX */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="batchId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={BATCH_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('batchId', value || undefined);
              }}
              options={BATCH_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Lô SX"
                  placeholder="Chọn lô sản xuất (Truy vết)"
                  error={!!getError('batchId')}
                  helperText={getError('batchId')}
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

      {/* Khối lượng (kg) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="quantity"
          value={values.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Khối lượng"
          placeholder="Nhập khối lượng"
          fullWidth
          required
          error={!!getError('quantity')}
          helperText={getError('quantity')}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              step: 0.01
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin vận chuyển */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin vận chuyển
        </Typography>
      </Grid>

      {/* Thông tin vận chuyển */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="transportRef"
          value={values.transportRef || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Thông tin vận chuyển"
          placeholder="Xe / Container"
          fullWidth
          error={!!getError('transportRef')}
          helperText={getError('transportRef')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Chứng từ */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Chứng từ
        </Typography>
      </Grid>

      {/* Chứng từ - File Upload */}
      <Grid size={12}>
        <Field name="referenceDoc">
          {({ field, meta }: FieldProps) => (
            <Box>
              {isReadOnly ? (
                <Box>
                  {values.referenceDoc ? (
                    <Box
                      component="a"
                      href={typeof values.referenceDoc === 'string' ? values.referenceDoc : URL.createObjectURL(values.referenceDoc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'inline-block',
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        textDecoration: 'none',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <Typography variant="body2">Xem chứng từ</Typography>
                    </Box>
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
                        Chưa có chứng từ
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <SingleFileUpload
                  file={getFileArray(values.referenceDoc)}
                  setFieldValue={createSetFieldValueWrapper('referenceDoc')}
                  error={!!(meta.touched && meta.error)}
                  accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] }}
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

      {/* Section: Trạng thái và ghi chú */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Trạng thái và ghi chú
        </Typography>
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
          options={SHIPMENT_STATUS_OPTIONS}
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

export default ShipmentForm;
