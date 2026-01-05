// ==============================|| TRANSFER FORM COMPONENT ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { BATCH_OPTIONS, ITEM_TYPE_OPTIONS, SKU_OPTIONS, STATUS_OPTIONS, UNIT_OPTIONS, WAREHOUSE_OPTIONS } from '../types/constants';
import type { TransferFormData, TransferItemFormData } from '../types/index';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface TransferFormProps {
  mode: FormMode;
}

// ==============================|| TRANSFER FORM ||============================== //

const TransferForm = ({ mode }: TransferFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<TransferFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof TransferFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  const getItemError = (index: number, field: keyof TransferItemFormData): string | undefined => {
    const itemsError = errors.items;
    if (Array.isArray(itemsError) && itemsError[index]) {
      const itemError = itemsError[index] as Record<string, unknown> | undefined;
      if (itemError && typeof itemError === 'object' && field in itemError) {
        return itemError[field] as string | undefined;
      }
    }
    return undefined;
  };

  // Handle add item
  const handleAddItem = useCallback(() => {
    const newItem: TransferItemFormData = {
      skuId: '',
      skuCode: '',
      skuName: '',
      quantity: 0,
      unit: 'Kg'
    };
    setFieldValue('items', [...values.items, newItem]);
  }, [values.items, setFieldValue]);

  // Handle remove item
  const handleRemoveItem = useCallback(
    (index: number) => {
      const newItems = values.items.filter((_, i) => i !== index);
      setFieldValue('items', newItems);
    },
    [values.items, setFieldValue]
  );

  // Handle item field change
  const handleItemFieldChange = useCallback(
    (index: number, field: keyof TransferItemFormData, value: unknown) => {
      const newItems = [...values.items];
      const item = { ...newItems[index] };

      if (field === 'skuId') {
        // When SKU changes, update skuCode and skuName
        const sku = SKU_OPTIONS.find((opt) => opt.value === value);
        if (sku) {
          item.skuId = value as string;
          item.skuCode = sku.value;
          item.skuName = sku.label;
        }
      } else {
        item[field] = value as never;
      }

      newItems[index] = item;
      setFieldValue('items', newItems);
    },
    [values.items, setFieldValue]
  );

  // Filter SKU options by itemType
  const filteredSkuOptions = SKU_OPTIONS.filter((sku) => sku.itemType === values.itemType);

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã phiếu chuyển - Auto-generated, always read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã phiếu chuyển"
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

      {/* Ngày chuyển */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          label="Ngày chuyển"
          value={values.transferDate ? dateHelper.normalizeDateValue(values.transferDate) : null}
          onChange={(newValue) => {
            setFieldValue('transferDate', newValue ? newValue.toDate() : new Date());
          }}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: !!getError('transferDate'),
              helperText: getError('transferDate'),
              readOnly: isReadOnly
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

      {/* Kho nguồn */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="sourceWarehouseId"
          value={values.sourceWarehouseId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Kho nguồn"
          fullWidth
          required
          error={!!getError('sourceWarehouseId')}
          helperText={getError('sourceWarehouseId')}
          options={WAREHOUSE_OPTIONS}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
        />
      </Grid>

      {/* Kho đích */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="destinationWarehouseId"
          value={values.destinationWarehouseId}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Kho đích"
          fullWidth
          required
          error={!!getError('destinationWarehouseId')}
          helperText={getError('destinationWarehouseId')}
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

      {/* Section: Danh sách SKU */}
      <Grid size={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Danh sách SKU
          </Typography>
          {!isReadOnly && (
            <Button variant="outlined" size="small" startIcon={<PlusOutlined />} onClick={handleAddItem}>
              Thêm SKU
            </Button>
          )}
        </Stack>
      </Grid>

      {/* Items Table */}
      <Grid size={12}>
        {values.items.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có SKU nào. Vui lòng thêm SKU.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Lô</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Đơn vị</TableCell>
                  {!isReadOnly && <TableCell align="center">Hành động</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {values.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {isReadOnly ? (
                        <Typography variant="body2">
                          {item.skuCode} - {item.skuName}
                        </Typography>
                      ) : (
                        <SelectField
                          value={item.skuId}
                          onChange={(e) => handleItemFieldChange(index, 'skuId', e.target.value)}
                          options={[
                            { value: '', label: 'Chọn SKU' },
                            ...filteredSkuOptions.map((opt) => ({
                              value: opt.value,
                              label: `${opt.label} (${opt.itemType === 'material' ? 'NL' : 'TP'})`
                            }))
                          ]}
                          fullWidth
                          size="small"
                          error={!!getItemError(index, 'skuId')}
                          helperText={getItemError(index, 'skuId')}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isReadOnly ? (
                        <Typography variant="body2">
                          {item.batchId ? BATCH_OPTIONS.find((opt) => opt.value === item.batchId)?.label : '-'}
                        </Typography>
                      ) : (
                        <SelectField
                          value={item.batchId || ''}
                          onChange={(e) => handleItemFieldChange(index, 'batchId', e.target.value || undefined)}
                          options={[{ value: '', label: 'Không có' }, ...BATCH_OPTIONS]}
                          fullWidth
                          size="small"
                          error={!!getItemError(index, 'batchId')}
                          helperText={getItemError(index, 'batchId')}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isReadOnly ? (
                        <Typography variant="body2" align="right">
                          {item.quantity.toLocaleString('vi-VN')}
                        </Typography>
                      ) : (
                        <NumberField
                          value={item.quantity}
                          onChange={(e) => handleItemFieldChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          fullWidth
                          size="small"
                          error={!!getItemError(index, 'quantity')}
                          helperText={getItemError(index, 'quantity')}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isReadOnly ? (
                        <Typography variant="body2">{item.unit}</Typography>
                      ) : (
                        <SelectField
                          value={item.unit}
                          onChange={(e) => handleItemFieldChange(index, 'unit', e.target.value)}
                          options={UNIT_OPTIONS}
                          fullWidth
                          size="small"
                          error={!!getItemError(index, 'unit')}
                          helperText={getItemError(index, 'unit')}
                        />
                      )}
                    </TableCell>
                    {!isReadOnly && (
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                          <DeleteOutlined />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {touched.items && errors.items && typeof errors.items === 'string' && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
            {errors.items}
          </Typography>
        )}
      </Grid>

      {/* Section: Thông tin vận chuyển và ghi chú */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Thông tin vận chuyển và ghi chú
        </Typography>
      </Grid>

      {/* Thông tin vận chuyển */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          name="transportRef"
          value={values.transportRef || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Thông tin vận chuyển"
          placeholder="Nhập thông tin vận chuyển"
          fullWidth
          error={!!getError('transportRef')}
          helperText={getError('transportRef')}
          slotProps={{
            input: {
              readOnly: isReadOnly
            }
          }}
          sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
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

export default TransferForm;
