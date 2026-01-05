// ==============================|| QUALITY INSPECTION FORM COMPONENT ||============================== //

import { Box, Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

import type { QualityInspectionFormData } from '../types';
import { QC_RESULT_OPTIONS, PRODUCT_OPTIONS, BATCH_OPTIONS, INSPECTOR_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface QualityInspectionFormProps {
  mode: FormMode;
}

// ==============================|| QUALITY INSPECTION FORM ||============================== //

const QualityInspectionForm = ({ mode }: QualityInspectionFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<QualityInspectionFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof QualityInspectionFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  // Convert file/string to CustomFile array for dropzone
  const getFileArray = (file: string | File | CustomFile[] | undefined): CustomFile[] | null => {
    if (!file) return null;
    if (Array.isArray(file)) {
      return file;
    }
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

  // Auto-suggest result based on moisture and impurity thresholds
  // This is a simple example - adjust thresholds based on business requirements
  const suggestResult = (moisture: number, impurity: number): 'passed' | 'failed' => {
    // Example thresholds: moisture <= 12% and impurity <= 2%
    if (moisture <= 12 && impurity <= 2) {
      return 'passed';
    }
    return 'failed';
  };

  // Handle moisture change - auto-suggest result
  const handleMoistureChange = (value: number) => {
    setFieldValue('moisture', value);
    if (values.impurity !== undefined) {
      const suggestedResult = suggestResult(value, values.impurity);
      setFieldValue('result', suggestedResult);
    }
  };

  // Handle impurity change - auto-suggest result
  const handleImpurityChange = (value: number) => {
    setFieldValue('impurity', value);
    if (values.moisture !== undefined) {
      const suggestedResult = suggestResult(values.moisture, value);
      setFieldValue('result', suggestedResult);
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

      {/* Mã phiếu QC - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã phiếu QC"
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

      {/* Ngày kiểm định */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          name="inspectionDate"
          value={dateHelper.normalizeDateValue(values.inspectionDate)}
          onChange={(value) => setFieldValue('inspectionDate', value ? dateHelper.toDateString(value.toDate()) : '')}
          label="Ngày kiểm định"
          error={!!getError('inspectionDate')}
          helperText={getError('inspectionDate')}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Thành phẩm */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="productId"
          value={values.productId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Thành phẩm"
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

      {/* Lô sản xuất */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="batchId"
          value={values.batchId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Lô sản xuất"
          fullWidth
          required
          error={!!getError('batchId')}
          helperText={getError('batchId')}
          options={BATCH_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Người kiểm tra */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="inspectorId"
          value={values.inspectorId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Người kiểm tra"
          fullWidth
          required
          error={!!getError('inspectorId')}
          helperText={getError('inspectorId')}
          options={INSPECTOR_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Kết quả kiểm định */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          Kết quả kiểm định
        </Typography>
      </Grid>

      {/* Độ ẩm (%) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="moisture"
          value={values.moisture}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            handleMoistureChange(value);
          }}
          onBlur={handleBlur}
          label="Độ ẩm (%)"
          placeholder="Nhập độ ẩm"
          fullWidth
          required
          error={!!getError('moisture')}
          helperText={getError('moisture') || 'Giới hạn theo tiêu chuẩn'}
          slotProps={{
            input: {
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              max: 100,
              step: 0.01
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Tạp chất (%) */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <NumberField
          name="impurity"
          value={values.impurity}
          onChange={(e) => {
            const value = parseFloat(e.target.value) || 0;
            handleImpurityChange(value);
          }}
          onBlur={handleBlur}
          label="Tạp chất (%)"
          placeholder="Nhập tạp chất"
          fullWidth
          required
          error={!!getError('impurity')}
          helperText={getError('impurity')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            },
            htmlInput: {
              min: 0,
              max: 100,
              step: 0.01
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Kết quả QC */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="result"
          value={values.result}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Kết quả QC"
          fullWidth
          required
          error={!!getError('result')}
          helperText={getError('result') || 'Tự gợi ý theo ngưỡng'}
          options={QC_RESULT_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: File và ghi chú */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
          File và ghi chú
        </Typography>
      </Grid>

      {/* File kiểm định */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          File kiểm định <Typography component="span">(Biên bản / Ảnh)</Typography>
        </Typography>
        {isReadOnly && values.attachment ? (
          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper'
            }}
          >
            {typeof values.attachment === 'string' ? (
              <a href={values.attachment} target="_blank" rel="noopener noreferrer">
                {values.attachment}
              </a>
            ) : (
              <Typography variant="body2">{String(values.attachment)}</Typography>
            )}
          </Box>
        ) : (
          <SingleFileUpload
            file={getFileArray(values.attachment)}
            setFieldValue={createSetFieldValueWrapper('attachment')}
            error={!!getError('attachment')}
          />
        )}
      </Grid>

      {/* Ghi chú */}
      <Grid size={{ xs: 12, sm: 6 }}>
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

export default QualityInspectionForm;
