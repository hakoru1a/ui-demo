// ==============================|| INVENTORY REPORT FILTER DRAWER ||============================== //

import { CloseOutlined } from '@ant-design/icons';
import { Box, Button, Drawer, IconButton, Stack, Typography, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import dateHelper from 'utils/dateHelper';

import type { DashboardFilter } from '../../types';

interface InventoryReportFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: DashboardFilter) => void;
  initialFilter: DashboardFilter;
}

const InventoryReportFilterDrawer = ({ open, onClose, onApply, initialFilter }: InventoryReportFilterDrawerProps) => {
  const [date, setDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.startDate || null));
  const [warehouseId, setWarehouseId] = useState<string>(initialFilter.warehouseId || '');
  const [skuId, setSkuId] = useState<string>(initialFilter.skuId || '');

  const handleApply = () => {
    onApply({
      startDate: date ? date.toDate() : null,
      endDate: null, // Add endDate as required by DashboardFilter
      warehouseId: warehouseId || null,
      skuId: skuId || null
    });
    onClose();
  };

  const handleReset = () => {
    setDate(null);
    setWarehouseId('');
    setSkuId('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 400 }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h5">Bộ lọc báo cáo tồn kho</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>

        <Stack spacing={3} sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <DatePickerField
                  label="Thời điểm"
                  value={date}
                  onChange={(value) => setDate(value)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  label="Kho"
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  options={[
                    { label: 'Tất cả', value: '' },
                    { label: 'Kho A', value: 'warehouse-a' },
                    { label: 'Kho B', value: 'warehouse-b' }
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  label="SKU"
                  value={skuId}
                  onChange={(e) => setSkuId(e.target.value)}
                  options={[
                    { label: 'Tất cả', value: '' },
                    { label: 'SKU-001', value: 'sku-001' },
                    { label: 'SKU-002', value: 'sku-002' }
                  ]}
                  fullWidth
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" fullWidth onClick={handleReset}>
            Đặt lại
          </Button>
          <Button variant="contained" fullWidth onClick={handleApply}>
            Áp dụng
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default InventoryReportFilterDrawer;
