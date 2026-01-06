// ==============================|| STOCKTAKE FORM COMPONENT ||============================== //

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { Box, Button, Card, Divider, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useFormikContext } from 'formik';
import { useCallback, useMemo } from 'react';

// project imports
import AutocompleteField from 'components/fields/AutocompleteField';
import DatePickerField from 'components/fields/DatePickerField';
import NumberField from 'components/fields/NumberField';
import RichField from 'components/fields/RichField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import dateHelper from 'utils/dateHelper';

import { getMockSkus } from '../../sku/mock/skus';
import type { StocktakeFormData, StocktakeItemFormData } from '../types';
import { STOCKTAKE_STATUS_OPTIONS, WAREHOUSE_OPTIONS } from '../types/constants';

// ==============================|| FORM MODE TYPE ||============================== //

export type FormMode = 'create' | 'edit' | 'view';

export interface StocktakeFormProps {
  mode: FormMode;
}

// ==============================|| STOCKTAKE FORM ||============================== //

const StocktakeForm = ({ mode }: StocktakeFormProps) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<StocktakeFormData>();

  const isReadOnly = mode === 'view';

  const getError = (field: keyof StocktakeFormData): string | undefined => {
    const error = touched[field] && errors[field];
    return typeof error === 'string' ? error : undefined;
  };

  // Get SKU options based on selected warehouse
  const skuOptions = useMemo(() => {
    // TODO: Replace with API call to get SKUs by warehouse
    const allSkus = getMockSkus();
    if (!values.warehouseId) return allSkus;
    return allSkus.filter((sku) => sku.warehouseId === values.warehouseId);
  }, [values.warehouseId]);

  // Get SKU option label
  const getSkuOptionLabel = (option: (typeof skuOptions)[0]) => {
    return `${option.code} - ${option.name}`;
  };

  // Handle add new item
  const handleAddItem = useCallback(() => {
    const newItem: StocktakeItemFormData = {
      skuId: '',
      skuCode: '',
      skuName: '',
      systemQty: 0,
      actualQty: 0,
      difference: 0,
      reason: undefined
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

  // Handle SKU selection for an item
  const handleSkuChange = useCallback(
    (index: number, sku: (typeof skuOptions)[0] | null) => {
      const newItems = [...values.items];
      if (sku) {
        newItems[index] = {
          ...newItems[index],
          skuId: sku.id,
          skuCode: sku.code,
          skuName: sku.name,
          systemQty: sku.systemQuantity,
          actualQty: newItems[index].actualQty || 0,
          difference: (newItems[index].actualQty || 0) - sku.systemQuantity
        };
      } else {
        newItems[index] = {
          ...newItems[index],
          skuId: '',
          skuCode: '',
          skuName: '',
          systemQty: 0,
          difference: 0
        };
      }
      setFieldValue('items', newItems);
    },
    [values.items, setFieldValue]
  );

  // Handle actual quantity change
  const handleActualQtyChange = useCallback(
    (index: number, value: number) => {
      const newItems = [...values.items];
      const item = newItems[index];
      const systemQty = item.systemQty || 0;
      const actualQty = value || 0;
      const difference = actualQty - systemQty;

      newItems[index] = {
        ...item,
        actualQty,
        difference,
        reason: difference !== 0 ? item.reason : undefined // Clear reason if difference is 0
      };
      setFieldValue('items', newItems);
    },
    [values.items, setFieldValue]
  );

  // Handle reason change
  const handleReasonChange = useCallback(
    (index: number, value: string) => {
      const newItems = [...values.items];
      newItems[index] = {
        ...newItems[index],
        reason: value
      };
      setFieldValue('items', newItems);
    },
    [values.items, setFieldValue]
  );

  // Get item error
  const getItemError = (index: number, field: keyof StocktakeItemFormData): string | undefined => {
    const itemsError = errors.items;
    if (Array.isArray(itemsError) && itemsError[index]) {
      const itemError = itemsError[index] as Partial<Record<keyof StocktakeItemFormData, string>>;
      return itemError?.[field] as string | undefined;
    }
    return undefined;
  };

  return (
    <Grid container spacing={3}>
      {/* Section: Thông tin cơ bản */}
      <Grid size={12}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Thông tin cơ bản
        </Typography>
      </Grid>

      {/* Mã phiếu kiểm kê - Read-only */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TextField
          name="code"
          value={values.code}
          label="Mã phiếu kiểm kê"
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

      {/* Ngày kiểm kê */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <DatePickerField
          label="Ngày kiểm kê"
          value={values.inventoryDate ? dateHelper.normalizeDateValue(values.inventoryDate) : null}
          onChange={(newValue) => {
            setFieldValue('inventoryDate', newValue ? newValue.toDate() : new Date());
          }}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: !!getError('inventoryDate'),
              helperText: getError('inventoryDate'),
              readOnly: isReadOnly
            }
          }}
        />
      </Grid>

      {/* Kho */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SelectField
          name="warehouseId"
          value={values.warehouseId}
          onChange={(e) => {
            handleChange(e);
            // Clear items when warehouse changes
            if (e.target.value !== values.warehouseId) {
              setFieldValue('items', []);
            }
          }}
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
          options={STOCKTAKE_STATUS_OPTIONS}
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
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Danh sách SKU ({values.items.length})
          </Typography>
          {!isReadOnly && (
            <Button variant="outlined" size="small" startIcon={<PlusOutlined />} onClick={handleAddItem} disabled={!values.warehouseId}>
              Thêm SKU
            </Button>
          )}
        </Stack>
      </Grid>

      {/* SKU Items */}
      {values.items.map((item, index) => (
        <Grid size={12} key={item.id || item.skuId || `item-${index}`}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                SKU #{index + 1}
              </Typography>
              {!isReadOnly && (
                <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                  <DeleteOutlined />
                </IconButton>
              )}
            </Stack>

            <Grid container spacing={2}>
              {/* SKU Selection */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AutocompleteField
                  options={skuOptions}
                  getOptionLabel={getSkuOptionLabel}
                  value={skuOptions.find((sku) => sku.id === item.skuId) || null}
                  onChange={(_: any, newValue: any) => handleSkuChange(index, newValue)}
                  disabled={isReadOnly}
                  fullWidth
                  renderOption={(props: any, option: any) => (
                    <Box component="li" {...props} key={option.id}>
                      <Stack>
                        <Typography variant="body2" fontWeight={600}>
                          {option.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.name}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                  slotProps={{
                    textField: {
                      label: 'SKU - Hàng hóa',
                      required: true,
                      error: !!getItemError(index, 'skuId'),
                      helperText: getItemError(index, 'skuId')
                    }
                  }}
                />
              </Grid>

              {/* System Qty - Read-only */}
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <NumberField
                  name={`items.${index}.systemQty`}
                  value={item.systemQty}
                  label="SL hệ thống"
                  fullWidth
                  disabled
                  helperText="Tự động"
                />
              </Grid>

              {/* Actual Qty */}
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <NumberField
                  name={`items.${index}.actualQty`}
                  value={item.actualQty}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    handleActualQtyChange(index, value);
                  }}
                  onBlur={handleBlur}
                  label="SL thực tế"
                  fullWidth
                  required
                  error={!!getItemError(index, 'actualQty')}
                  helperText={getItemError(index, 'actualQty')}
                  disabled={isReadOnly}
                  sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
                />
              </Grid>

              {/* Difference - Read-only */}
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <NumberField
                  name={`items.${index}.difference`}
                  value={item.difference}
                  label="Chênh lệch"
                  fullWidth
                  disabled
                  helperText="Tự động"
                  sx={{
                    '& .MuiInputBase-input': {
                      color: item.difference < 0 ? 'error.main' : item.difference > 0 ? 'success.main' : 'text.primary',
                      fontWeight: item.difference !== 0 ? 600 : 400
                    }
                  }}
                />
              </Grid>

              {/* Reason - Conditional (Required if difference ≠ 0) */}
              {item.difference !== 0 && (
                <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                  <TextField
                    name={`items.${index}.reason`}
                    value={item.reason || ''}
                    onChange={(e) => handleReasonChange(index, e.target.value)}
                    onBlur={handleBlur}
                    label="Lý do chênh lệch"
                    placeholder="Nhập lý do chênh lệch..."
                    fullWidth
                    required
                    multiline
                    rows={2}
                    error={!!getItemError(index, 'reason')}
                    helperText={getItemError(index, 'reason')}
                    slotProps={{
                      input: {
                        readOnly: isReadOnly
                      }
                    }}
                    sx={isReadOnly ? { '& .MuiInputBase-root': { opacity: 1 } } : undefined}
                  />
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
      ))}

      {/* Section: Ghi chú */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Ghi chú
        </Typography>
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

export default StocktakeForm;
