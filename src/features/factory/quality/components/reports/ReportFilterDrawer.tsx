// ==============================|| QUALITY REPORT FILTER DRAWER ||============================== //

import { CloseOutlined } from '@ant-design/icons';
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';

// project imports
import Field from 'components/fields';
import dateHelper from 'utils/dateHelper';

import { PRODUCT_OPTIONS, BATCH_OPTIONS } from '../../types/constants';
import type { QualityReportFilter } from '../../types/report';

interface ReportFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filter: QualityReportFilter) => void;
  initialFilter: QualityReportFilter;
}

const ReportFilterDrawer = ({ open, onClose, onApply, initialFilter }: ReportFilterDrawerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(initialFilter.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialFilter.endDate || null);
  const [productIds, setProductIds] = useState<string[]>(initialFilter.productIds || []);
  const [batchIds, setBatchIds] = useState<string[]>(initialFilter.batchIds || []);

  const selectedProducts = PRODUCT_OPTIONS.filter((option) => productIds.includes(option.value));
  const selectedBatches = BATCH_OPTIONS.filter((option) => batchIds.includes(option.value));

  const handleApply = () => {
    onApply({
      startDate,
      endDate,
      productIds,
      batchIds
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setProductIds([]);
    setBatchIds([]);
  };

  const handleProductChange = (_: React.SyntheticEvent, newValue: typeof PRODUCT_OPTIONS) => {
    setProductIds(newValue.map((option) => option.value));
  };

  const handleBatchChange = (_: React.SyntheticEvent, newValue: typeof BATCH_OPTIONS) => {
    setBatchIds(newValue.map((option) => option.value));
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
            options={PRODUCT_OPTIONS}
            value={selectedProducts}
            onChange={handleProductChange}
            getOptionLabel={(option: { value: string; label: string }) => option.label}
            isOptionEqualToValue={(option: { value: string; label: string }, value: { value: string; label: string }) =>
              option.value === value.value
            }
            label="Sản phẩm"
            placeholder="Chọn sản phẩm"
          />

          <Field.Autocomplete
            multiple
            options={BATCH_OPTIONS}
            value={selectedBatches}
            onChange={handleBatchChange}
            getOptionLabel={(option: { value: string; label: string }) => option.label}
            isOptionEqualToValue={(option: { value: string; label: string }, value: { value: string; label: string }) =>
              option.value === value.value
            }
            label="Lô"
            placeholder="Chọn lô"
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
