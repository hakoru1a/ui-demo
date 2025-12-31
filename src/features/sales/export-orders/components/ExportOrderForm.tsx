// ==============================|| EXPORT ORDER FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import AutocompleteField from 'components/fields/AutocompleteField';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { EXPORT_ORDER_STATUS_OPTIONS, INCOTERMS_OPTIONS, CURRENCY_OPTIONS, COUNTRY_OPTIONS } from '../types/constants';
import type { ExportOrderFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface ExportOrderFormProps {
  mode: FormMode;
}

// Mock customer options - TODO: Replace with actual customer API call
const MOCK_CUSTOMER_OPTIONS = [
  { value: 'customer-001', label: 'Công ty ABC International' },
  { value: 'customer-002', label: 'XYZ Trading Co., Ltd.' },
  { value: 'customer-003', label: 'Global Export Import Inc.' },
  { value: 'customer-004', label: 'Pacific Trading Company' },
  { value: 'customer-005', label: 'European Wood Products Ltd.' }
];

// ==============================|| EXPORT ORDER FORM ||============================== //

const ExportOrderForm = ({ mode }: ExportOrderFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<ExportOrderFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof ExportOrderFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã đơn hàng - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="orderNo"
          value={values.orderNo}
          label="Mã đơn hàng"
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

      {/* Ngày đơn hàng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="orderDate">
          {({ field, meta }: FieldProps) => {
            const dateValue = field.value ? dateHelper.from(field.value) : null;
            return (
              <DatePickerField
                label="Ngày đơn hàng"
                value={dateValue}
                onChange={(newValue) => {
                  setFieldValue('orderDate', newValue ? dateHelper.formatDate(newValue) : '');
                }}
                format="DD/MM/YYYY"
                error={!!getError('orderDate')}
                helperText={getError('orderDate') as string | undefined}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    inputProps: {
                      readOnly: isReadOnly
                    }
                  }
                }}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Khách hàng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="customerId">
          {({ field }: FieldProps) => {
            type CustomerOption = { value: string; label: string };
            return (
              <AutocompleteField
                {...field}
                value={MOCK_CUSTOMER_OPTIONS.find((opt) => opt.value === field.value) || null}
                onChange={(_: React.SyntheticEvent, newValue: CustomerOption | null) => {
                  setFieldValue('customerId', newValue?.value || '');
                }}
                options={MOCK_CUSTOMER_OPTIONS}
                getOptionLabel={(option: CustomerOption) => option.label}
                isOptionEqualToValue={(option: CustomerOption, val: CustomerOption) => option.value === val.value}
                readOnly={isReadOnly}
                label="Khách hàng"
                placeholder="Chọn khách hàng"
                required
                error={!!getError('customerId')}
                helperText={getError('customerId') as string | undefined}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Quốc gia */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="country"
          value={values.country}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Quốc gia"
          placeholder="Chọn quốc gia"
          options={COUNTRY_OPTIONS}
          fullWidth
          required
          error={!!getError('country')}
          helperText={getError('country')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin giá trị */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin giá trị
        </Typography>
      </Grid>

      {/* Tổng giá trị */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="totalValue"
          value={values.totalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tổng giá trị"
          placeholder="Nhập tổng giá trị"
          fullWidth
          required
          error={!!getError('totalValue')}
          helperText={getError('totalValue')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Tiền tệ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="currency"
          value={values.currency}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tiền tệ"
          placeholder="Chọn tiền tệ"
          options={CURRENCY_OPTIONS}
          fullWidth
          required
          error={!!getError('currency')}
          helperText={getError('currency')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Incoterms */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="incoterms"
          value={values.incoterms}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Incoterms"
          placeholder="Chọn Incoterms"
          options={INCOTERMS_OPTIONS}
          fullWidth
          required
          error={!!getError('incoterms')}
          helperText={getError('incoterms')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
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
          placeholder="Chọn trạng thái"
          options={EXPORT_ORDER_STATUS_OPTIONS}
          fullWidth
          required
          error={!!getError('status')}
          helperText={getError('status')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>
    </Grid>
  );
};

export default ExportOrderForm;
