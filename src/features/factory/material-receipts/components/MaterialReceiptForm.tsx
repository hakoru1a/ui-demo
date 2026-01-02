// ==============================|| MATERIAL RECEIPT FORM COMPONENT ||============================== //

import { Grid, InputAdornment, Box, Typography } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

import type { MaterialReceiptFormData } from '../types';
import { MATERIAL_TYPE_OPTIONS, RECEIPT_STATUS_OPTIONS, SUPPLIER_OPTIONS, WAREHOUSE_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface MaterialReceiptFormProps {
  mode: FormMode;
}

// ==============================|| MATERIAL RECEIPT FORM ||============================== //

const MaterialReceiptForm = ({ mode }: MaterialReceiptFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<MaterialReceiptFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof MaterialReceiptFormData) => touched[field] && errors[field];

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
      const fileArray = Array.isArray(value) ? value : [];
      const file = fileArray.length > 0 ? fileArray[0] : null;
      setFieldValue(fieldName, file);
    } else {
      setFieldValue(field, value);
    }
  };

  // Calculate total value when quantity or unitPrice changes
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    const newQuantity = parseFloat(e.target.value) || 0;
    const price = values.unitPrice || 0;
    setFieldValue('totalValue', newQuantity * price);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    const newPrice = parseFloat(e.target.value) || 0;
    const quantity = values.quantity || 0;
    setFieldValue('totalValue', quantity * newPrice);
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã phiếu nhập - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã phiếu nhập"
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

      {/* Ngày nhập kho */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          name="receiptDate"
          value={dateHelper.normalizeDateValue(values.receiptDate)}
          onChange={(value) => setFieldValue('receiptDate', value ? value.toDate() : dateHelper.getToday())}
          label="Ngày nhập kho"
          disabled={isReadOnly}
          slotProps={{
            textField: {
              error: !!getError('receiptDate'),
              helperText: getError('receiptDate') as string | undefined,
              fullWidth: true
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Nhà cung cấp */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="supplierId"
          value={values.supplierId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Nhà cung cấp"
          fullWidth
          required
          error={!!getError('supplierId')}
          helperText={getError('supplierId')}
          options={SUPPLIER_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Kho nhập */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="warehouseId"
          value={values.warehouseId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Kho nhập"
          fullWidth
          required
          error={!!getError('warehouseId')}
          helperText={getError('warehouseId')}
          options={WAREHOUSE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Loại nguyên liệu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="materialType"
          value={values.materialType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại nguyên liệu"
          fullWidth
          required
          error={!!getError('materialType')}
          helperText={getError('materialType')}
          options={MATERIAL_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
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
          label="Trạng thái phiếu"
          fullWidth
          required
          error={!!getError('status')}
          helperText={getError('status')}
          options={RECEIPT_STATUS_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Thông tin khối lượng và giá */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin khối lượng và giá
        </Typography>
      </Grid>

      {/* Khối lượng (kg) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="quantity"
          value={values.quantity}
          onChange={handleQuantityChange}
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

      {/* Đơn giá ước tính */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="unitPrice"
          value={values.unitPrice || ''}
          onChange={handlePriceChange}
          onBlur={handleBlur}
          label="Đơn giá ước tính"
          placeholder="Tự động (tham chiếu bảng giá)"
          fullWidth
          error={!!getError('unitPrice')}
          helperText={getError('unitPrice') || 'Tự động tham chiếu bảng giá'}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
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

      {/* Tổng giá trị ước tính (Auto) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="totalValue"
          value={values.totalValue || ''}
          label="Tổng giá trị ước tính"
          placeholder="Tự động tính"
          fullWidth
          disabled
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              readOnly: true
            }
          }}
          helperText="Tự động tính (Khối lượng × Đơn giá)"
        />
      </Grid>

      {/* Section: Chứng từ */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Chứng từ
        </Typography>
      </Grid>

      {/* Chứng từ (File Upload) */}
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
                  accept={{ 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
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

export default MaterialReceiptForm;
