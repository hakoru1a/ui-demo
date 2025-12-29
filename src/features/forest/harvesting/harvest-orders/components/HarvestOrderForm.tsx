// ==============================|| HARVEST ORDER FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Box, Typography, Autocomplete } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';
import { useMemo } from 'react';

// project imports
import FieldComponents from 'components/fields';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import { mockHarvestPlans } from 'features/forest/harvesting/harvest-plans/mock/harvestPlans';
import dateHelper from 'utils/dateHelper';

import { HARVEST_ORDER_EXECUTOR_OPTIONS, HARVEST_ORDER_STATUS_OPTIONS } from '../types/constants';
import type { HarvestOrderFormData } from '../types/index';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface HarvestOrderFormProps {
  mode: FormMode;
  isCreated?: boolean; // Đã tạo - không cho đổi kế hoạch
}

// ==============================|| HARVEST ORDER FORM ||============================== //

const HarvestOrderForm = ({ mode, isCreated = false }: HarvestOrderFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<HarvestOrderFormData>();

  const isReadOnly = mode === 'view';
  const planDisabled = isReadOnly || mode !== 'create' || isCreated; // Không cho đổi sau khi tạo

  const getError = (field: keyof HarvestOrderFormData) => touched[field] && errors[field];

  // Plans options for Autocomplete
  const planOptions = useMemo(() => {
    return mockHarvestPlans.map((plan) => ({
      id: plan.id,
      label: plan.name,
      forestAreaId: plan.forestAreaId,
      forestAreaName: plan.forestArea?.name || ''
    }));
  }, []);

  // Handle plan change -> auto update forestAreaId
  const handlePlanChange = (_: React.SyntheticEvent, newValue: (typeof planOptions)[0] | (typeof planOptions)[0][] | null) => {
    // Autocomplete without multiple prop returns single value, but TypeScript allows array
    const singleValue = Array.isArray(newValue) ? newValue[0] || null : newValue;
    if (singleValue) {
      setFieldValue('planId', singleValue.id);
      setFieldValue('forestAreaId', singleValue.forestAreaId);
    } else {
      setFieldValue('planId', '');
      setFieldValue('forestAreaId', '');
    }
  };

  // Find selected plan to show selected state correctly in Autocomplete
  const selectedPlan = planOptions.find((p) => p.id === values.planId) || null;

  // Find forest area name based on plan
  const forestAreaName = useMemo(() => {
    if (values.forestAreaId) {
      const plan = mockHarvestPlans.find((p) => p.id === values.planId);
      return plan?.forestArea?.name || values.forestAreaId;
    }
    return '';
  }, [values.forestAreaId, values.planId]);

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã lệnh khai thác - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã lệnh khai thác"
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

      {/* Kế hoạch khai thác */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="planId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={selectedPlan}
              onChange={handlePlanChange}
              options={planOptions}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.id === val.id}
              readOnly={planDisabled}
              disabled={planDisabled}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Kế hoạch khai thác"
                  placeholder="Chọn kế hoạch khai thác"
                  required
                  error={!!getError('planId')}
                  helperText={getError('planId') || (isCreated ? 'Không đổi sau khi tạo' : undefined)}
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

      {/* Khu vực rừng - Auto-fill from plan, read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="forestAreaName"
          value={forestAreaName}
          label="Khu vực rừng"
          placeholder="Tự động điền từ kế hoạch"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          helperText="Lấy từ kế hoạch"
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
          options={HARVEST_ORDER_STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly || mode === 'create'
            }
          }}
          disabled={isReadOnly || mode === 'create'}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Ngày khai thác */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="startDate">
          {({ field, meta }: FieldProps) => {
            const dayjsValue = dateHelper.normalizeDateValue(field.value);
            return (
              <DatePickerField
                label="Ngày khai thác"
                value={dayjsValue}
                onChange={(newValue) => {
                  setFieldValue('startDate', newValue ? newValue.toDate() : null);
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

      {/* Sản lượng thực tế (m³) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="actualYield"
          value={values.actualYield}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Sản lượng thực tế"
          placeholder="Nhập sản lượng"
          fullWidth
          required
          error={!!getError('actualYield')}
          helperText={getError('actualYield')}
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

      {/* Đơn vị thực hiện */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="executorType"
          value={values.executorType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Đơn vị thực hiện"
          fullWidth
          error={!!getError('executorType')}
          helperText={getError('executorType')}
          options={HARVEST_ORDER_EXECUTOR_OPTIONS}
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
          name="note"
          value={values.note || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Ghi chú"
          placeholder="Nhập ghi chú"
          fullWidth
          multiline
          rows={3}
          error={!!getError('note')}
          helperText={getError('note')}
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

export default HarvestOrderForm;
