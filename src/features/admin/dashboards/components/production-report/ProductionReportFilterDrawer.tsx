// ==============================|| PRODUCTION REPORT FILTER DRAWER ||============================== //

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

interface ProductionReportFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: DashboardFilter) => void;
  initialFilter: DashboardFilter;
}

const ProductionReportFilterDrawer = ({ open, onClose, onApply, initialFilter }: ProductionReportFilterDrawerProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.startDate || null));
  const [endDate, setEndDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.endDate || null));
  const [planId, setPlanId] = useState<string>(initialFilter.planId || '');
  const [shiftId, setShiftId] = useState<string>(initialFilter.shiftId || '');
  const [productId, setProductId] = useState<string>(initialFilter.productId || '');

  const handleApply = () => {
    onApply({
      startDate: startDate ? startDate.toDate() : null,
      endDate: endDate ? endDate.toDate() : null,
      planId: planId || null,
      shiftId: shiftId || null,
      productId: productId || null
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setPlanId('');
    setShiftId('');
    setProductId('');
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
          <Typography variant="h5">Bộ lọc báo cáo sản xuất</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>

        <Stack spacing={3} sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <DatePickerField
                  label="Từ ngày"
                  value={startDate}
                  onChange={(value) => setStartDate(value)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={12}>
                <DatePickerField
                  label="Đến ngày"
                  value={endDate}
                  onChange={(value) => setEndDate(value)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  label="Kế hoạch / Lệnh SX"
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  options={[
                    { label: 'Tất cả', value: '' },
                    { label: 'PO-2024-001', value: 'po-1' }
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  label="Ca sản xuất"
                  value={shiftId}
                  onChange={(e) => setShiftId(e.target.value)}
                  options={[
                    { label: 'Tất cả', value: '' },
                    { label: 'Ca 1', value: 'shift-1' },
                    { label: 'Ca 2', value: 'shift-2' },
                    { label: 'Ca 3', value: 'shift-3' }
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  label="Sản phẩm"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  options={[
                    { label: 'Tất cả', value: '' },
                    { label: 'Sản phẩm 1', value: 'product-1' }
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

export default ProductionReportFilterDrawer;
