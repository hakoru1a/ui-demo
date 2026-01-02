// ==============================|| WEIGH TICKET FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Box, Typography, Autocomplete } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';
import { useEffect } from 'react';

// project imports
import FieldComponents from 'components/fields';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';

import type { WeighTicketFormData } from '../types';
import { WEIGH_TICKET_TYPE_OPTIONS, SUPPLIER_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface WeighTicketFormProps {
  mode: FormMode;
}

// ==============================|| WEIGH TICKET FORM ||============================== //

const WeighTicketForm = ({ mode }: WeighTicketFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<WeighTicketFormData>();

  const isReadOnly = mode === 'view';
  const ticketType = values.type;

  const getError = (field: keyof WeighTicketFormData) => touched[field] && errors[field];

  // Auto-calculate weightDifference when weightIn or weightOut changes
  useEffect(() => {
    if (values.weightIn && values.weightOut) {
      const difference = values.weightOut - values.weightIn;
      setFieldValue('weightDifference', difference >= 0 ? difference : 0);
    } else if (values.weightOut && !values.weightIn) {
      // For outbound, if only weightOut is set, difference is 0
      setFieldValue('weightDifference', 0);
    } else if (values.weightIn && !values.weightOut) {
      // For inbound, if only weightIn is set, difference is 0
      setFieldValue('weightDifference', 0);
    } else {
      setFieldValue('weightDifference', undefined);
    }
  }, [values.weightIn, values.weightOut, setFieldValue]);

  // Auto-calculate estimatedAmount when weightDifference and unitPrice are available
  useEffect(() => {
    if (values.weightDifference && values.unitPrice) {
      const amount = values.weightDifference * values.unitPrice;
      setFieldValue('estimatedAmount', amount >= 0 ? amount : 0);
    } else {
      setFieldValue('estimatedAmount', undefined);
    }
  }, [values.weightDifference, values.unitPrice, setFieldValue]);

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã phiếu cân - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã phiếu cân"
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

      {/* Biển số xe */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="vehiclePlate"
          value={values.vehiclePlate}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Biển số xe"
          placeholder="Nhập biển số xe"
          fullWidth
          required
          error={!!getError('vehiclePlate')}
          helperText={getError('vehiclePlate')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Nhà cung cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="supplierId">
          {({ field }: FieldProps) => (
            <Autocomplete
              {...field}
              value={SUPPLIER_OPTIONS.find((opt) => opt.value === field.value) || null}
              onChange={(_, newValue) => {
                const value = Array.isArray(newValue) ? newValue[0]?.value : newValue?.value;
                setFieldValue('supplierId', value || '');
              }}
              options={SUPPLIER_OPTIONS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              readOnly={isReadOnly}
              renderInput={(params) => (
                <FieldComponents.Text
                  {...params}
                  label="Nhà cung cấp"
                  placeholder="Chọn nhà cung cấp"
                  required
                  error={!!getError('supplierId')}
                  helperText={getError('supplierId')}
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

      {/* Loại phiếu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại phiếu"
          fullWidth
          required
          error={!!getError('type')}
          helperText={getError('type')}
          options={WEIGH_TICKET_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin cân */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin cân
        </Typography>
      </Grid>

      {/* Trọng lượng vào (kg) - Conditional: Inbound */}
      {ticketType === 'inbound' && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <NumberField
            name="weightIn"
            value={values.weightIn || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Trọng lượng vào (kg)"
            placeholder="Nhập trọng lượng vào"
            fullWidth
            required
            error={!!getError('weightIn')}
            helperText={getError('weightIn')}
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
      )}

      {/* Trọng lượng ra (kg) - Conditional: Outbound */}
      {ticketType === 'outbound' && (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <NumberField
            name="weightOut"
            value={values.weightOut || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Trọng lượng ra (kg)"
            placeholder="Nhập trọng lượng ra"
            fullWidth
            required
            error={!!getError('weightOut')}
            helperText={getError('weightOut')}
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
      )}

      {/* Khối lượng chênh lệch (kg) - Auto: Out - In */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="weightDifference"
          value={values.weightDifference || ''}
          label="Khối lượng chênh lệch (kg)"
          placeholder="Tự động tính"
          fullWidth
          disabled
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              readOnly: true
            }
          }}
          helperText="Tự động tính: Trọng lượng ra - Trọng lượng vào"
        />
      </Grid>

      {/* Đơn giá áp dụng - Auto: Theo bảng giá */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="unitPrice"
          value={values.unitPrice || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Đơn giá áp dụng"
          placeholder="Tự động theo bảng giá"
          fullWidth
          error={!!getError('unitPrice')}
          helperText={getError('unitPrice') || 'Tự động theo bảng giá'}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">VNĐ/kg</InputAdornment>,
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              step: 1000
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Thành tiền (ước tính) - Auto */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="estimatedAmount"
          value={values.estimatedAmount || ''}
          label="Thành tiền (ước tính)"
          placeholder="Tự động tính"
          fullWidth
          disabled
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              readOnly: true
            }
          }}
          helperText="Tự động tính: Khối lượng chênh lệch × Đơn giá"
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

export default WeighTicketForm;
