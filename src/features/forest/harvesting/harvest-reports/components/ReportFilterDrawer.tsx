import { CloseOutlined } from '@ant-design/icons';
import { Box, Button, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import { ReportFilter } from '../types/index';

interface ReportFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: ReportFilter) => void;
  initialFilter: ReportFilter;
}

const ReportFilterDrawer = ({ open, onClose, onApply, initialFilter }: ReportFilterDrawerProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(initialFilter.startDate ? dayjs(initialFilter.startDate) : null);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialFilter.endDate ? dayjs(initialFilter.endDate) : null);
  const [forestAreaIds, setForestAreaIds] = useState<string[]>(initialFilter.forestAreaIds);

  const handleApply = () => {
    onApply({
      startDate: startDate ? startDate.toDate() : null,
      endDate: endDate ? endDate.toDate() : null,
      forestAreaIds
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setForestAreaIds([]);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 320 }
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
            <DatePicker
              label="Từ ngày"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="Đến ngày"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Khu vực rừng</InputLabel>
            <Select
              multiple
              value={forestAreaIds}
              label="Khu vực rừng"
              onChange={(e) => {
                const { value } = e.target;
                setForestAreaIds(typeof value === 'string' ? value.split(',') : value);
              }}
            >
              <MenuItem value="area-a">Khu A</MenuItem>
              <MenuItem value="area-b">Khu B</MenuItem>
              <MenuItem value="area-c">Khu C</MenuItem>
            </Select>
          </FormControl>
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
