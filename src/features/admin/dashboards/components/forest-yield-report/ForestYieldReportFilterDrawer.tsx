// ==============================|| FOREST YIELD REPORT FILTER DRAWER ||============================== //

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

interface ForestYieldReportFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: DashboardFilter) => void;
  initialFilter: DashboardFilter;
}

const ForestYieldReportFilterDrawer = ({ open, onClose, onApply, initialFilter }: ForestYieldReportFilterDrawerProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.startDate || null));
  const [endDate, setEndDate] = useState<Dayjs | null>(dateHelper.normalizeDateValue(initialFilter.endDate || null));
  const [forestAreaId, setForestAreaId] = useState<string>(initialFilter.forestAreaId || '');
  const [certificateType, setCertificateType] = useState<string>(initialFilter.certificateType || '');

  const handleApply = () => {
    onApply({
      startDate: startDate ? startDate.toDate() : null,
      endDate: endDate ? endDate.toDate() : null,
      forestAreaId: forestAreaId || null,
      certificateType: (certificateType as 'FSC' | 'PEFC') || null
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setForestAreaId('');
    setCertificateType('');
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
          <Typography variant="h5">Bộ lọc báo cáo sản lượng</Typography>
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
                  label="Vùng trồng"
                  value={forestAreaId}
                  onChange={(e) => setForestAreaId(e.target.value)}
                  options={[
                    { label: 'Tất cả', value: '' },
                    { label: 'Vùng A', value: 'area-a' },
                    { label: 'Vùng B', value: 'area-b' }
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  label="Chứng chỉ"
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value)}
                  options={[
                    { label: 'Tất cả', value: '' },
                    { label: 'FSC', value: 'FSC' },
                    { label: 'PEFC', value: 'PEFC' }
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

export default ForestYieldReportFilterDrawer;
