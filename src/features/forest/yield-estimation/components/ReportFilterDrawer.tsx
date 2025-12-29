// ==============================|| YIELD ESTIMATION REPORT FILTER DRAWER ||============================== //

import { CloseOutlined } from '@ant-design/icons';
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';

// project imports
import Field from 'components/fields';
import dateHelper from 'utils/dateHelper';

import { YieldReportFilter } from '../types/report';

interface ReportFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: YieldReportFilter) => void;
  initialFilter: YieldReportFilter;
  supplierOptions: Array<{ value: string; label: string }>;
}

const ReportFilterDrawer = ({ open, onClose, onApply, initialFilter, supplierOptions }: ReportFilterDrawerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(initialFilter.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialFilter.endDate || null);
  const [supplierIds, setSupplierIds] = useState<string[]>(initialFilter.supplierIds);

  const selectedSuppliers = supplierOptions.filter((option) => supplierIds.includes(option.value));

  const handleApply = () => {
    onApply({
      startDate,
      endDate,
      supplierIds
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSupplierIds([]);
  };

  const handleSupplierChange = (_: React.SyntheticEvent, newValue: typeof supplierOptions) => {
    setSupplierIds(newValue.map((option) => option.value));
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
          <Typography variant="h5">Bộ lọc báo cáo</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>

        <Stack spacing={3} sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Field.DatePicker
              label="Từ ngày"
              value={dateHelper.normalizeDateValue(startDate)}
              onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <Field.DatePicker
              label="Đến ngày"
              value={dateHelper.normalizeDateValue(endDate)}
              onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <Field.Autocomplete
            multiple
            options={supplierOptions}
            value={selectedSuppliers}
            onChange={handleSupplierChange}
            getOptionLabel={(option: { value: string; label: string }) => option.label}
            isOptionEqualToValue={(option: { value: string; label: string }, value: { value: string; label: string }) =>
              option.value === value.value
            }
            label="Nhà cung cấp"
            placeholder="Chọn nhà cung cấp"
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="outlined" color="secondary" fullWidth onClick={handleReset}>
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

export default ReportFilterDrawer;
