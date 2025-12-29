// ==============================|| SUPPLIER TRANSACTION FILTER POPOVER ||============================== //

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import { Box, Button, ClickAwayListener, Divider, IconButton, Paper, Popper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useEffect } from 'react';

// project imports
import Transitions from 'components/@extended/Transitions';
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import type { Supplier, SupplierTransactionHistoryFilters, TransactionType, TransactionStatus } from '../types';
import { TRANSACTION_TYPE_OPTIONS, TRANSACTION_STATUS_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

interface SupplierTransactionFilterPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  supplier: Supplier | null;
  filters: SupplierTransactionHistoryFilters;
  onFilterChange: (filters: SupplierTransactionHistoryFilters) => void;
}

// ==============================|| FILTER POPOVER ||============================== //

const SupplierTransactionFilterPopover = ({
  open,
  onClose,
  anchorEl,
  supplier,
  filters,
  onFilterChange
}: SupplierTransactionFilterPopoverProps) => {
  const [localFilters, setLocalFilters] = useState<SupplierTransactionHistoryFilters>(filters);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Sync local filters when filters prop changes
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      // Reset dates when popover opens
      setStartDate(null);
      setEndDate(null);
    }
  }, [filters, open]);

  // Count active filters
  const activeFilterCount =
    (localFilters.startDate ? 1 : 0) + (localFilters.endDate ? 1 : 0) + (localFilters.type ? 1 : 0) + (localFilters.status ? 1 : 0);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: SupplierTransactionHistoryFilters = {
      supplierId: supplier?.id,
      startDate: undefined,
      endDate: undefined,
      type: undefined,
      status: undefined
    };
    setLocalFilters(resetFilters);
    setStartDate(null);
    setEndDate(null);
    onFilterChange(resetFilters);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setLocalFilters((prev) => ({ ...prev, startDate: date || undefined }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setLocalFilters((prev) => ({ ...prev, endDate: date || undefined }));
  };

  return (
    <Popper
      placement="bottom-end"
      open={open}
      anchorEl={anchorEl}
      transition
      disablePortal={false}
      sx={{ zIndex: 1500 }}
      popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
    >
      {({ TransitionProps }) => (
        <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
          <Paper
            elevation={8}
            sx={(theme) => ({
              boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.12)',
              width: { xs: 'calc(100vw - 32px)', sm: 750 },
              maxHeight: 'calc(100vh - 200px)',
              overflow: 'auto',
              borderRadius: 2
            })}
          >
            <ClickAwayListener onClickAway={onClose}>
              <MainCard
                elevation={0}
                border={false}
                content={false}
                title={
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FilterOutlined />
                      <span>Bộ lọc</span>
                      {activeFilterCount > 0 && (
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {activeFilterCount}
                        </Box>
                      )}
                    </Stack>
                    <IconButton size="small" onClick={onClose}>
                      <CloseOutlined />
                    </IconButton>
                  </Stack>
                }
              >
                <Divider />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Nhà cung cấp - Read-only, Full width */}
                      <Grid size={12}>
                        <TextField label="Nhà cung cấp" value={supplier?.name || ''} fullWidth disabled />
                      </Grid>

                      {/* Thời gian giao dịch - Date Range, 2 columns */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <DatePickerField
                          label="Từ ngày"
                          value={dateHelper.normalizeDateValue(startDate)}
                          onChange={(newValue) => handleStartDateChange(newValue ? newValue.toDate() : null)}
                          slotProps={{
                            textField: {
                              fullWidth: true
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <DatePickerField
                          label="Đến ngày"
                          value={dateHelper.normalizeDateValue(endDate)}
                          onChange={(newValue) => handleEndDateChange(newValue ? newValue.toDate() : null)}
                          slotProps={{
                            textField: {
                              fullWidth: true
                            }
                          }}
                        />
                      </Grid>

                      {/* Loại giao dịch và Trạng thái - 2 columns */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <SelectField
                          label="Loại giao dịch"
                          value={localFilters.type || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setLocalFilters((prev) => ({ ...prev, type: value ? (value as TransactionType) : undefined }));
                          }}
                          options={[{ value: '', label: 'Tất cả' }, ...TRANSACTION_TYPE_OPTIONS]}
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <SelectField
                          label="Trạng thái"
                          value={localFilters.status || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setLocalFilters((prev) => ({ ...prev, status: value ? (value as TransactionStatus) : undefined }));
                          }}
                          options={[{ value: '', label: 'Tất cả' }, ...TRANSACTION_STATUS_OPTIONS]}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </LocalizationProvider>
                <Divider />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 2.5 }}>
                  <Button onClick={onClose} color="inherit" size="medium">
                    Hủy
                  </Button>
                  <Button onClick={handleReset} color="error" variant="outlined" size="medium">
                    Đặt lại
                  </Button>
                  <Button onClick={handleApply} variant="contained" size="medium">
                    Áp dụng
                  </Button>
                </Stack>
              </MainCard>
            </ClickAwayListener>
          </Paper>
        </Transitions>
      )}
    </Popper>
  );
};

export default SupplierTransactionFilterPopover;
