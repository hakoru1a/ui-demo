// ==============================|| SKU FORM COMPONENT ||============================== //

import { Grid, Typography } from '@mui/material';
import { useFormikContext } from 'formik';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import type { SkuFormData } from '../types';
import { ITEM_TYPE_OPTIONS, WAREHOUSE_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface SkuFormProps {
  mode: FormMode;
}

// ==============================|| SKU FORM ||============================== //

const SkuForm = ({ mode }: SkuFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<SkuFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof SkuFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* SKU Code - Read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã SKU"
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

      {/* Tên hàng hóa - Read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="name"
          value={values.name}
          label="Tên hàng hóa"
          placeholder="Tên hàng hóa"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
      </Grid>

      {/* Loại hàng */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="itemType"
          value={values.itemType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Loại hàng"
          fullWidth
          required
          error={!!getError('itemType')}
          helperText={getError('itemType')}
          options={ITEM_TYPE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Kho */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="warehouseId"
          value={values.warehouseId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Kho"
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

      {/* Section: Số lượng */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Số lượng
        </Typography>
      </Grid>

      {/* Số lượng hệ thống - Read-only, Auto */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="systemQuantity"
          value={values.systemQuantity}
          label="SL hệ thống"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          helperText="Tự động tính từ hệ thống"
        />
      </Grid>

      {/* Số lượng giữ chỗ - Read-only, Auto */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="reservedQuantity"
          value={values.reservedQuantity}
          label="SL giữ chỗ"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          helperText="Tự động tính từ hệ thống"
        />
      </Grid>

      {/* Số lượng khả dụng - Read-only, Auto */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="availableQuantity"
          value={values.availableQuantity}
          label="SL khả dụng"
          fullWidth
          disabled
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          helperText="Tự động tính từ hệ thống"
        />
      </Grid>

      {/* Section: Thông tin khác */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin khác
        </Typography>
      </Grid>

      {/* Ngày kiểm kê gần nhất */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          label="Ngày kiểm kê gần nhất"
          value={values.lastInventoryDate ? dateHelper.normalizeDateValue(values.lastInventoryDate) : null}
          onChange={(newValue) => {
            setFieldValue('lastInventoryDate', newValue ? newValue.toDate() : undefined);
          }}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!getError('lastInventoryDate'),
              helperText: getError('lastInventoryDate'),
              readOnly: isReadOnly
            }
          }}
        />
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

export default SkuForm;
