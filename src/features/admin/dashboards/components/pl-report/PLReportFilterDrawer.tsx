// ==============================|| P&L REPORT FILTER DRAWER ||============================== //

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

interface PLReportFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: DashboardFilter) => void;
  initialFilter: DashboardFilter;
}

const FACTORY_OPTIONS = [
  { label: 'Nhà máy A', value: 'factory-a' },
  { label: 'Nhà máy B', value: 'factory-b' },
  { label: 'Nhà máy C', value: 'factory-c' }
];

const PERIOD_OPTIONS = [
  { label: 'Tháng', value: 'month' },
  { label: 'Quý', value: 'quarter' },
  { label: 'Năm', value: 'year' }
];

const PLReportFilterDrawer = ({ open, onClose, onApply, initialFilter }: PLReportFilterDrawerProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.startDate || null));
  const [endDate, setEndDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.endDate || null));
  const [factoryId, setFactoryId] = useState<string>(initialFilter.factoryId || '');
  const [contractId, setContractId] = useState<string>(initialFilter.contractId || '');
  const [period, setPeriod] = useState<string>(initialFilter.period || 'month');

  const handleApply = () => {
    onApply({
      startDate: startDate ? startDate.toDate() : null,
      endDate: endDate ? endDate.toDate() : null,
      factoryId: factoryId || null,
      contractId: contractId || null,
      period: (period as 'day' | 'month' | 'quarter') || null
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFactoryId('');
    setContractId('');
    setPeriod('month');
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
          <Typography variant="h5">Bộ lọc báo cáo P&L</Typography>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>

        <Stack spacing={3} sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <SelectField
                  label="Kỳ báo cáo"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  options={PERIOD_OPTIONS}
                  fullWidth
                />
              </Grid>
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
                  label="Nhà máy"
                  value={factoryId}
                  onChange={(e) => setFactoryId(e.target.value)}
                  options={[{ label: 'Tất cả', value: '' }, ...FACTORY_OPTIONS]}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  label="Hợp đồng / PAB"
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  options={[
                    { label: 'Tất cả', value: '' },
                    { label: 'Hợp đồng 1', value: 'contract-1' }
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

export default PLReportFilterDrawer;
