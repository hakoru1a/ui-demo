// ==============================|| EXPORT DOCUMENT FORM COMPONENT ||============================== //

import { Grid, Typography, Box } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';
import { useEffect } from 'react';

// project imports
import AutocompleteField from 'components/fields/AutocompleteField';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

import { DOCUMENT_TYPE_OPTIONS, DOCUMENT_STATUS_OPTIONS, CURRENCY_OPTIONS } from '../types/constants';
import type { ExportDocumentFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface ExportDocumentFormProps {
  mode: FormMode;
}

// Mock export order options - TODO: Replace with actual API call
const getMockExportOrderOptions = () => [
  { value: '1', label: 'XK001 - Công ty ABC International' },
  { value: '2', label: 'XK002 - XYZ Trading Co., Ltd.' },
  { value: '3', label: 'XK003 - Global Export Import Inc.' },
  { value: '4', label: 'XK004 - Pacific Trading Company' }
];

// ==============================|| EXPORT DOCUMENT FORM ||============================== //

const ExportDocumentForm = ({ mode }: ExportDocumentFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<ExportDocumentFormData>();

  const isReadOnly = mode === 'view';
  const isPackingList = values.documentType === 'packing-list';

  const getError = (field: keyof ExportDocumentFormData) => touched[field] && errors[field];

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

  // When export order changes, update customer and total amount
  useEffect(() => {
    if (values.exportOrderId && mode !== 'view') {
      // TODO: Fetch export order details and update customerId, customerName, totalAmount, currency
      // For now, using mock data
      const mockOrder = getMockExportOrderOptions().find((opt) => opt.value === values.exportOrderId);
      if (mockOrder) {
        // Mock: Extract customer from order label
        setFieldValue('customerId', 'customer-001');
        setFieldValue('customerName', mockOrder.label.split(' - ')[1] || '');
        setFieldValue('totalAmount', 50000);
        setFieldValue('currency', 'USD');
      }
    }
  }, [values.exportOrderId, mode, setFieldValue]);

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã chứng từ - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="documentNo"
          value={values.documentNo}
          label="Mã chứng từ"
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

      {/* Loại chứng từ */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="documentType"
          value={values.documentType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại chứng từ"
          placeholder="Chọn loại chứng từ"
          options={DOCUMENT_TYPE_OPTIONS}
          fullWidth
          required
          error={!!getError('documentType')}
          helperText={getError('documentType')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Đơn hàng XK */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="exportOrderId">
          {({ field }: FieldProps) => {
            type ExportOrderOption = { value: string; label: string };
            const options = getMockExportOrderOptions();
            return (
              <AutocompleteField
                {...field}
                value={options.find((opt) => opt.value === field.value) || null}
                onChange={(_: React.SyntheticEvent, newValue: ExportOrderOption | null) => {
                  setFieldValue('exportOrderId', newValue?.value || '');
                }}
                options={options}
                getOptionLabel={(option: ExportOrderOption) => option.label}
                isOptionEqualToValue={(option: ExportOrderOption, val: ExportOrderOption) => option.value === val.value}
                readOnly={isReadOnly}
                label="Đơn hàng XK"
                placeholder="Chọn đơn hàng XK"
                required
                error={!!getError('exportOrderId')}
                helperText={getError('exportOrderId') as string | undefined}
                disabled={isReadOnly}
                sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
              />
            );
          }}
        </Field>
      </Grid>

      {/* Khách hàng - Auto, Read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="customerName"
          value={values.customerName || ''}
          label="Khách hàng"
          placeholder="Tự động từ đơn hàng"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          helperText="Tự động lấy từ đơn hàng XK"
        />
      </Grid>

      {/* Ngày hóa đơn */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="invoiceDate">
          {({ field, meta }: FieldProps) => {
            const dateValue = field.value ? dateHelper.from(field.value) : null;
            return (
              <DatePickerField
                label="Ngày hóa đơn"
                value={dateValue}
                onChange={(newValue) => {
                  setFieldValue('invoiceDate', newValue ? dateHelper.formatDate(newValue) : '');
                }}
                format="DD/MM/YYYY"
                error={!!getError('invoiceDate')}
                helperText={getError('invoiceDate') as string | undefined}
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

      {/* Tổng giá trị - Auto from order */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="totalAmount"
          value={values.totalAmount}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tổng giá trị"
          placeholder="Tự động từ đơn hàng"
          fullWidth
          required
          disabled
          error={!!getError('totalAmount')}
          helperText={getError('totalAmount') || 'Tự động lấy từ đơn hàng'}
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
      </Grid>

      {/* Section: Thông tin Packing List (Conditional) */}
      {isPackingList && (
        <>
          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
              Thông tin Packing List
            </Typography>
          </Grid>

          {/* Số kiện - Required for Packing List */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <NumberField
              name="packageCount"
              value={values.packageCount || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Số kiện"
              placeholder="Nhập số kiện"
              fullWidth
              required
              error={!!getError('packageCount')}
              helperText={getError('packageCount')}
              slotProps={{
                input: {
                  readOnly: isReadOnly
                }
              }}
              disabled={isReadOnly}
              sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
            />
          </Grid>

          {/* Trọng lượng gross */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <NumberField
              name="grossWeight"
              value={values.grossWeight || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Trọng lượng gross"
              placeholder="Nhập trọng lượng gross"
              fullWidth
              error={!!getError('grossWeight')}
              helperText={getError('grossWeight')}
              slotProps={{
                input: {
                  readOnly: isReadOnly
                }
              }}
              disabled={isReadOnly}
              sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
            />
          </Grid>

          {/* Trọng lượng net */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <NumberField
              name="netWeight"
              value={values.netWeight || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Trọng lượng net"
              placeholder="Nhập trọng lượng net"
              fullWidth
              error={!!getError('netWeight')}
              helperText={getError('netWeight')}
              slotProps={{
                input: {
                  readOnly: isReadOnly
                }
              }}
              disabled={isReadOnly}
              sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
            />
          </Grid>
        </>
      )}

      {/* Section: Thông tin bổ sung */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin bổ sung
        </Typography>
      </Grid>

      {/* HS Code */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="hsCode"
          value={values.hsCode || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="HS Code"
          placeholder="Nhập HS Code"
          fullWidth
          error={!!getError('hsCode')}
          helperText={getError('hsCode')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* File chứng từ */}
      <Grid size={12}>
        <Field name="attachment">
          {({ field, meta }: FieldProps) => (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                File chứng từ (PDF / Scan)
              </Typography>
              {isReadOnly ? (
                <Box>
                  {values.attachment ? (
                    <Box
                      component="a"
                      href={typeof values.attachment === 'string' ? values.attachment : URL.createObjectURL(values.attachment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
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
                      <Typography variant="body2">Xem file đính kèm</Typography>
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
                        Chưa có file đính kèm
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <SingleFileUpload
                  file={getFileArray(values.attachment)}
                  setFieldValue={createSetFieldValueWrapper('attachment')}
                  error={!!(meta.touched && meta.error)}
                  accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
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
          placeholder="Chọn trạng thái"
          options={DOCUMENT_STATUS_OPTIONS}
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

export default ExportDocumentForm;
