// ==============================|| LOGISTICS COST FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import AutocompleteField from 'components/fields/AutocompleteField';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

import type { LogisticsCostFormData } from '../types';
import {
  COST_TYPE_OPTIONS,
  SERVICE_CATEGORY_OPTIONS,
  ALLOCATION_METHOD_OPTIONS,
  STATUS_OPTIONS,
  CURRENCY_OPTIONS,
  PARTNER_OPTIONS,
  SHIPMENT_OPTIONS,
  ORDER_OPTIONS
} from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface LogisticsCostFormProps {
  mode: FormMode;
}

// ==============================|| LOGISTICS COST FORM ||============================== //

const LogisticsCostForm = ({ mode }: LogisticsCostFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<LogisticsCostFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof LogisticsCostFormData) => touched[field] && errors[field];

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

      {/* Mã chi phí - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="costCode"
          value={values.costCode}
          label="Mã chi phí"
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

      {/* Loại chi phí */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="costType"
          value={values.costType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại chi phí"
          fullWidth
          required
          error={!!getError('costType')}
          helperText={getError('costType')}
          options={COST_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Nhóm dịch vụ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="serviceCategory"
          value={values.serviceCategory || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Nhóm dịch vụ"
          fullWidth
          error={!!getError('serviceCategory')}
          helperText={getError('serviceCategory')}
          options={SERVICE_CATEGORY_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Đối tác */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="partnerId">
          {({ field }: FieldProps) => {
            type PartnerOption = { value: string; label: string };
            return (
              <AutocompleteField
                {...field}
                value={PARTNER_OPTIONS.find((opt) => opt.value === field.value) || null}
                onChange={(_: React.SyntheticEvent, newValue: PartnerOption | null) => {
                  setFieldValue('partnerId', newValue?.value || '');
                }}
                options={PARTNER_OPTIONS}
                getOptionLabel={(option: PartnerOption) => option.label}
                isOptionEqualToValue={(option: PartnerOption, val: PartnerOption) => option.value === val.value}
                readOnly={isReadOnly}
                label="Đối tác"
                placeholder="Chọn đối tác"
                required
                error={!!getError('partnerId')}
                helperText={getError('partnerId') as string | undefined}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Lô/Đơn liên quan */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="relatedShipmentId">
          {({ field }: FieldProps) => {
            type ShipmentOption = { value: string; label: string };
            return (
              <AutocompleteField
                {...field}
                value={SHIPMENT_OPTIONS.find((opt) => opt.value === field.value) || null}
                onChange={(_: React.SyntheticEvent, newValue: ShipmentOption | null) => {
                  setFieldValue('relatedShipmentId', newValue?.value || '');
                }}
                options={SHIPMENT_OPTIONS}
                getOptionLabel={(option: ShipmentOption) => option.label}
                isOptionEqualToValue={(option: ShipmentOption, val: ShipmentOption) => option.value === val.value}
                readOnly={isReadOnly}
                label="Lô liên quan"
                placeholder="Chọn lô"
                error={!!getError('relatedShipmentId')}
                helperText={getError('relatedShipmentId') as string | undefined}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="relatedOrderId">
          {({ field }: FieldProps) => {
            type OrderOption = { value: string; label: string };
            return (
              <AutocompleteField
                {...field}
                value={ORDER_OPTIONS.find((opt) => opt.value === field.value) || null}
                onChange={(_: React.SyntheticEvent, newValue: OrderOption | null) => {
                  setFieldValue('relatedOrderId', newValue?.value || '');
                }}
                options={ORDER_OPTIONS}
                getOptionLabel={(option: OrderOption) => option.label}
                isOptionEqualToValue={(option: OrderOption, val: OrderOption) => option.value === val.value}
                readOnly={isReadOnly}
                label="Đơn liên quan"
                placeholder="Chọn đơn"
                error={!!getError('relatedOrderId')}
                helperText={getError('relatedOrderId') as string | undefined}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Ngày phát sinh */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="costDate">
          {({ field, meta }: FieldProps) => {
            const dateValue = field.value ? dateHelper.from(field.value) : null;
            return (
              <DatePickerField
                label="Ngày phát sinh"
                value={dateValue}
                onChange={(newValue) => {
                  setFieldValue('costDate', newValue ? dateHelper.formatDate(newValue) : '');
                }}
                format="DD/MM/YYYY"
                error={!!getError('costDate')}
                helperText={getError('costDate') as string | undefined}
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

      {/* Section: Thông tin tài chính */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin tài chính
        </Typography>
      </Grid>

      {/* Số tiền */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="amount"
          value={values.amount}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số tiền"
          placeholder="Nhập số tiền"
          fullWidth
          required
          error={!!getError('amount')}
          helperText={getError('amount')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              step: 0.01
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
          fullWidth
          required
          error={!!getError('currency')}
          helperText={getError('currency')}
          options={CURRENCY_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Phân bổ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="allocationMethod"
          value={values.allocationMethod || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Phân bổ"
          fullWidth
          error={!!getError('allocationMethod')}
          helperText={getError('allocationMethod')}
          options={ALLOCATION_METHOD_OPTIONS}
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
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Chứng từ và ghi chú */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Chứng từ và ghi chú
        </Typography>
      </Grid>

      {/* Chứng từ */}
      <Grid size={12}>
        <Field name="attachment">
          {({ field }: FieldProps) => (
            <SingleFileUpload
              files={getFileArray(field.value)}
              setFieldValue={createSetFieldValueWrapper('attachment')}
              error={!!getError('attachment')}
              disabled={isReadOnly}
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
          rows={4}
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

export default LogisticsCostForm;
