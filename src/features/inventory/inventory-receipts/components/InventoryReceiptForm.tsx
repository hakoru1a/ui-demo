// ==============================|| INVENTORY RECEIPT FORM COMPONENT ||============================== //

import { Box, Grid, Typography } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

import type { InventoryReceiptFormData } from '../types';
import {
  BATCH_OPTIONS,
  PRODUCT_OPTIONS,
  RECEIPT_TYPE_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
  UNIT_OPTIONS,
  WAREHOUSE_OPTIONS
} from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface InventoryReceiptFormProps {
  mode: FormMode;
}

// ==============================|| INVENTORY RECEIPT FORM ||============================== //

const InventoryReceiptForm = ({ mode }: InventoryReceiptFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<InventoryReceiptFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof InventoryReceiptFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  // Convert file/string to CustomFile array for dropzone
  const getFileArray = (files: CustomFile[] | undefined): CustomFile[] | null => {
    if (!files || files.length === 0) return null;
    return files.map((file) => {
      if (typeof file === 'string' || (file as unknown as { url?: string }).url) {
        // If it's a URL string, create a mock file object
        const url = typeof file === 'string' ? file : (file as unknown as { url: string }).url;
        return {
          name: url.split('/').pop() || 'File',
          preview: url,
          size: 0,
          type: 'application/pdf'
        } as CustomFile;
      }
      // If it's a File, convert to CustomFile with preview
      return Object.assign(file, {
        preview: file.preview || URL.createObjectURL(file as File)
      }) as CustomFile;
    });
  };

  // Wrapper for setFieldValue to map 'files' to actual field name
  const createSetFieldValueWrapper = (fieldName: string) => (field: string, value: unknown) => {
    if (field === 'files') {
      // Extract files from the array
      const fileArray = Array.isArray(value) ? value : [];
      setFieldValue(fieldName, fileArray.length > 0 ? fileArray : undefined);
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

      {/* Ngày nhập */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          label="Ngày nhập"
          value={values.receiptDate ? dateHelper.normalizeDateValue(values.receiptDate) : null}
          onChange={(newValue) => {
            setFieldValue('receiptDate', newValue ? newValue.toDate() : new Date());
          }}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: !!getError('receiptDate'),
              helperText: getError('receiptDate'),
              readOnly: isReadOnly
            }
          }}
        />
      </Grid>

      {/* Loại nhập */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="receiptType"
          value={values.receiptType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại nhập"
          fullWidth
          required
          error={!!getError('receiptType')}
          helperText={getError('receiptType')}
          options={RECEIPT_TYPE_OPTIONS}
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

      {/* Section: Thông tin hàng hóa */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin hàng hóa
        </Typography>
      </Grid>

      {/* Hàng hóa */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="productId"
          value={values.productId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Hàng hóa"
          fullWidth
          required
          error={!!getError('productId')}
          helperText={getError('productId')}
          options={PRODUCT_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Lô */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="batchId"
          value={values.batchId || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Lô"
          fullWidth
          error={!!getError('batchId')}
          helperText={getError('batchId')}
          options={[{ value: '', label: 'Không có' }, ...BATCH_OPTIONS]}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Số lượng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="quantity"
          value={values.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số lượng"
          fullWidth
          required
          error={!!getError('quantity')}
          helperText={getError('quantity')}
          format="number"
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Đơn vị */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="unit"
          value={values.unit}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Đơn vị"
          fullWidth
          required
          error={!!getError('unit')}
          helperText={getError('unit')}
          options={UNIT_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Nguồn nhập */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="source"
          value={values.source || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Nguồn nhập"
          fullWidth
          error={!!getError('source')}
          helperText={getError('source')}
          options={[{ value: '', label: 'Không có' }, ...SOURCE_OPTIONS]}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Chứng từ <Typography component="span">(File Upload)</Typography>
        </Typography>
        <Field name="referenceDoc">
          {({ field, meta }: FieldProps) => (
            <Box>
              {isReadOnly && values.referenceDoc && values.referenceDoc.length > 0 ? (
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}
                >
                  {values.referenceDoc.map((file) => {
                    const fileKey = typeof file === 'string' ? file : file.name || String(file);
                    return (
                      <Box key={fileKey} sx={{ mb: 1 }}>
                        {typeof file === 'string' ? (
                          <a href={file} target="_blank" rel="noopener noreferrer">
                            {file}
                          </a>
                        ) : (
                          <Typography variant="body2">{file.name || String(file)}</Typography>
                        )}
                      </Box>
                    );
                  })}
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

      {/* Ghi chú */}
      <Grid size={12}>
        <RichField
          name="notes"
          value={values.notes || ''}
          onChange={(value) => setFieldValue('notes', value)}
          label="Ghi chú"
          placeholder="Nhập ghi chú..."
          fullWidth
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
    </Grid>
  );
};

export default InventoryReceiptForm;
