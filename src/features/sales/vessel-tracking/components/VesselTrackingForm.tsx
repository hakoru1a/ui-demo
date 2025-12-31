// ==============================|| VESSEL TRACKING FORM COMPONENT ||============================== //

import { Grid, Typography, Box } from '@mui/material';
import { useFormikContext, Field, FieldProps } from 'formik';

// project imports
import AutocompleteField from 'components/fields/AutocompleteField';
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import type { CustomFile } from 'types/dropzone';
import dateHelper from 'utils/dateHelper';

import { VESSEL_STATUS_OPTIONS, PORT_OPTIONS } from '../types/constants';
import type { VesselTrackingFormData } from '../types/form';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface VesselTrackingFormProps {
  mode: FormMode;
}

// Mock export order options - TODO: Replace with actual API call
const getMockExportOrderOptions = () => [
  { value: '1', label: 'XK001 - Công ty ABC International' },
  { value: '2', label: 'XK002 - XYZ Trading Co., Ltd.' },
  { value: '3', label: 'XK003 - Global Export Import Inc.' }
];

// ==============================|| VESSEL TRACKING FORM ||============================== //

const VesselTrackingForm = ({ mode }: VesselTrackingFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<VesselTrackingFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof VesselTrackingFormData) => touched[field] && errors[field];

  // Convert file/string to CustomFile array for dropzone
  const getFileArray = (file: string | File | undefined): CustomFile[] | null => {
    if (!file) return null;
    if (typeof file === 'string') {
      return [
        {
          name: file.split('/').pop() || 'File',
          preview: file,
          size: 0,
          type: 'application/pdf'
        } as CustomFile
      ];
    }
    return [
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      }) as CustomFile
    ];
  };

  const createSetFieldValueWrapper = (fieldName: string) => (field: string, value: any) => {
    if (field === 'files') {
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

      {/* Mã chuyến - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="shipmentNo"
          value={values.shipmentNo}
          label="Mã chuyến"
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

      {/* Tên tàu */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="vesselName"
          value={values.vesselName}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Tên tàu"
          placeholder="Nhập tên tàu"
          fullWidth
          required
          error={!!getError('vesselName')}
          helperText={getError('vesselName')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Số chuyến */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="voyageNo"
          value={values.voyageNo || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Số chuyến"
          placeholder="Nhập số chuyến"
          fullWidth
          error={!!getError('voyageNo')}
          helperText={getError('voyageNo')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Cảng đi */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="portOfLoading"
          value={values.portOfLoading}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Cảng đi"
          placeholder="Chọn cảng đi"
          options={PORT_OPTIONS}
          fullWidth
          required
          error={!!getError('portOfLoading')}
          helperText={getError('portOfLoading')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Cảng đến */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="portOfDischarge"
          value={values.portOfDischarge}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Cảng đến"
          placeholder="Chọn cảng đến"
          options={PORT_OPTIONS}
          fullWidth
          required
          error={!!getError('portOfDischarge')}
          helperText={getError('portOfDischarge')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          disabled={isReadOnly}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* ETD - Ngày rời cảng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="etd">
          {({ field, meta }: FieldProps) => {
            const dateValue = field.value ? dateHelper.from(field.value) : null;
            return (
              <DatePickerField
                label="ETD - Ngày rời cảng"
                value={dateValue}
                onChange={(newValue) => {
                  setFieldValue('etd', newValue ? dateHelper.formatDate(newValue) : '');
                }}
                format="DD/MM/YYYY"
                error={!!getError('etd')}
                helperText={getError('etd') as string | undefined}
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

      {/* ETA - Ngày đến dự kiến */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Field name="eta">
          {({ field, meta }: FieldProps) => {
            const dateValue = field.value ? dateHelper.from(field.value) : null;
            return (
              <DatePickerField
                label="ETA - Ngày đến dự kiến"
                value={dateValue}
                onChange={(newValue) => {
                  setFieldValue('eta', newValue ? dateHelper.formatDate(newValue) : '');
                }}
                format="DD/MM/YYYY"
                error={!!getError('eta')}
                helperText={getError('eta') as string | undefined}
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

      {/* Trạng thái tàu - Auto */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="currentStatus"
          value={values.currentStatus}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Trạng thái tàu"
          placeholder="Chọn trạng thái"
          options={VESSEL_STATUS_OPTIONS}
          fullWidth
          required
          error={!!getError('currentStatus')}
          helperText={getError('currentStatus') || 'Tự động cập nhật'}
          slotProps={{
            input: {
              readOnly: isReadOnly || mode === 'view'
            }
          }}
          disabled={isReadOnly || mode === 'view'}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Section: Chứng từ & Lộ trình */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Chứng từ & Lộ trình
        </Typography>
      </Grid>

      {/* Bill of Lading - Vận đơn */}
      <Grid size={12}>
        <Field name="billOfLading">
          {({ field, meta }: FieldProps) => (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Bill of Lading - Vận đơn
              </Typography>
              {isReadOnly ? (
                <Box>
                  {values.billOfLading ? (
                    <Box
                      component="a"
                      href={typeof values.billOfLading === 'string' ? values.billOfLading : URL.createObjectURL(values.billOfLading)}
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
                      <Typography variant="body2">Xem vận đơn</Typography>
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
                        Chưa có vận đơn
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <SingleFileUpload
                  file={getFileArray(values.billOfLading)}
                  setFieldValue={createSetFieldValueWrapper('billOfLading')}
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

      {/* Tracking Map - Lộ trình (read-only) */}
      <Grid size={12}>
        <TextField
          name="trackingMap"
          value={values.trackingMap || ''}
          label="Tracking Map - Lộ trình"
          placeholder="Hiển thị bản đồ (read-only)"
          fullWidth
          multiline
          rows={4}
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          helperText="Lộ trình sẽ được tự động cập nhật từ hệ thống tracking"
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

export default VesselTrackingForm;
