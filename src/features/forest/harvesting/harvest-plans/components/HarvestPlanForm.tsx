// ==============================|| HARVEST PLAN FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Box, Typography, Autocomplete } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import FieldComponents from 'components/fields';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import ToggleField from 'components/fields/ToggleField';
import dateHelper from 'utils/dateHelper';

import type { HarvestPlanFormData } from '../types';
import { HARVEST_PLAN_STATUS_OPTIONS, FOREST_AREA_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface HarvestPlanFormProps {
  mode: FormMode;
  isApproved?: boolean; // Đã phê duyệt - không cho tắt FSC
}

// ==============================|| HARVEST PLAN FORM ||============================== //

const HarvestPlanForm = ({ mode, isApproved = false }: HarvestPlanFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<HarvestPlanFormData>();

  const isReadOnly = mode === 'view';
  const fscDisabled = isApproved && values.fscStandard; // Không cho tắt nếu đã duyệt

  const getError = (field: keyof HarvestPlanFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã kế hoạch - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã kế hoạch"
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

      {/* Tên kế hoạch */}
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <TextField
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên kế hoạch"
          placeholder="Nhập tên kế hoạch"
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

      {/* Khu vực rừng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="forestAreaId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={FOREST_AREA_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('forestAreaId', value || '');
              }}
              options={FOREST_AREA_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Khu vực rừng"
                  placeholder="Chọn khu vực rừng"
                  required
                  error={!!getError('forestAreaId')}
                  helperText={getError('forestAreaId') || 'Phải thuộc danh mục FSC'}
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

      {/* Thời gian bắt đầu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="startDate">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Thời gian bắt đầu"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('startDate', newValue ? newValue.toDate() : null);
                  // Update endDate if it's before startDate
                  if (newValue && values.endDate) {
                    const endDate = dateHelper.normalizeDateValue(values.endDate);
                    if (endDate && endDate.isBefore(newValue)) {
                      setFieldValue('endDate', newValue.toDate());
                    }
                  }
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

      {/* Thời gian kết thúc */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="endDate">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            const startDate = dateHelper.normalizeDateValue(values.startDate);
            return (
              <DatePickerField
                label="Thời gian kết thúc"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('endDate', newValue ? newValue.toDate() : null);
                }}
                minDate={startDate || undefined}
                error={!!(meta.touched && meta.error)}
                helperText={meta.touched && meta.error ? meta.error : 'Phải lớn hơn hoặc bằng thời gian bắt đầu'}
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

      {/* Sản lượng dự kiến */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="expectedYield"
          value={values.expectedYield}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Sản lượng dự kiến"
          placeholder="Nhập sản lượng"
          fullWidth
          required
          error={!!getError('expectedYield')}
          helperText={getError('expectedYield') || 'Dùng cho báo cáo'}
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

      {/* Chuẩn FSC */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ToggleField
          name="fscStandard"
          checked={values.fscStandard}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Chuẩn FSC"
          disabled={fscDisabled || isReadOnly}
          error={!!getError('fscStandard')}
          helperText={getError('fscStandard') || (fscDisabled ? 'Không thể tắt khi đã phê duyệt' : undefined)}
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
          options={HARVEST_PLAN_STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Mô tả */}
      <Grid size={12}>
        <TextField
          name="description"
          value={values.description || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Mô tả"
          placeholder="Nhập mô tả"
          fullWidth
          multiline
          rows={3}
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

export default HarvestPlanForm;
