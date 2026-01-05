// ==============================|| PAB REPORT FILTER DRAWER ||============================== //

import { CloseOutlined } from '@ant-design/icons';
import { Box, Button, Drawer, IconButton, Stack, Typography, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';

// project imports
import DatePickerField from 'components/fields/DatePickerField';
import dateHelper from 'utils/dateHelper';

import type { PabReportFilter } from '../../types/report';

interface PabReportFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: PabReportFilter) => void;
  initialFilter: PabReportFilter;
}

const PabReportFilterDrawer = ({ open, onClose, onApply, initialFilter }: PabReportFilterDrawerProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.startDate || null));
  const [endDate, setEndDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.endDate || null));

  const handleApply = () => {
    onApply({
      startDate: startDate ? startDate.toDate() : null,
      endDate: endDate ? endDate.toDate() : null
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
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

export default PabReportFilterDrawer;
