// ==============================|| CUSTOMER FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

// project imports
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';

import { CUSTOMER_STATUS_OPTIONS, PAYMENT_TERMS_OPTIONS, CURRENCY_OPTIONS, COUNTRY_OPTIONS } from '../types/constants';
import type { CustomerFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface CustomerFormProps {
  mode: FormMode;
}

// ==============================|| CUSTOMER FORM ||============================== //

const CustomerForm = ({ mode }: CustomerFormProps) => {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<CustomerFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof CustomerFormData) => touched[field] && errors[field];

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã KH - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã KH"
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

      {/* Tên công ty */}
      <Grid size={{ xs: 12, sm: 6, md: 8 }}>
        <TextField
          name="companyName"
          value={values.companyName}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên công ty"
          placeholder="Nhập tên công ty"
          fullWidth
          required
          error={!!getError('companyName')}
          helperText={getError('companyName')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
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
          required
          error={!!getError('address')}
          helperText={getError('address')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Mã thuế */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="taxCode"
          value={values.taxCode || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Mã thuế"
          placeholder="Nhập mã thuế"
          fullWidth
          error={!!getError('taxCode')}
          helperText={getError('taxCode')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin liên hệ */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin liên hệ
        </Typography>
      </Grid>

      {/* Người liên hệ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="contactPerson"
          value={values.contactPerson}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Người liên hệ"
          placeholder="Nhập tên người liên hệ"
          fullWidth
          required
          error={!!getError('contactPerson')}
          helperText={getError('contactPerson')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Email */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Email"
          placeholder="Nhập email"
          fullWidth
          type="email"
          required
          error={!!getError('email')}
          helperText={getError('email')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Số điện thoại */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="phone"
          value={values.phone || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          fullWidth
          error={!!getError('phone')}
          helperText={getError('phone')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin giao dịch */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin giao dịch
        </Typography>
      </Grid>

      {/* Tiền tệ giao dịch */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="currency"
          value={values.currency}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tiền tệ giao dịch"
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

      {/* Điều khoản thanh toán */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="paymentTerms"
          value={values.paymentTerms || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Điều khoản thanh toán"
          placeholder="Chọn điều khoản thanh toán"
          options={PAYMENT_TERMS_OPTIONS}
          fullWidth
          error={!!getError('paymentTerms')}
          helperText={getError('paymentTerms')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Hạn mức tín dụng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="creditLimit"
          value={values.creditLimit || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Hạn mức tín dụng"
          placeholder="Nhập hạn mức tín dụng"
          fullWidth
          error={!!getError('creditLimit')}
          helperText={getError('creditLimit')}
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
          options={CUSTOMER_STATUS_OPTIONS}
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
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>
    </Grid>
  );
};

export default CustomerForm;
