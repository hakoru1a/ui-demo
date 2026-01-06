// ==============================|| EMPLOYEE TABLE HEADER ||============================== //
// Combines: StatusTabs + Toolbar + FilterPopover

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { ColumnFiltersState, Table } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

// project imports
import Transitions from 'components/@extended/Transitions';
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import { CSVExport, RowSelection, SelectColumnVisibility } from 'components/third-party/react-table';
import { useTableFilterDialog } from 'hooks/table';
import useBoolean from 'hooks/useBoolean';
import { StatusFilter } from 'types/status';
import dateHelper from 'utils/dateHelper';
import { getStatusColorMap } from 'utils/getStatusColor';

import type { Employee } from '../types';
import {
  EMPLOYEE_URLS,
  DEPARTMENT_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  STATUS_OPTIONS as EMPLOYEE_STATUS_OPTIONS,
  CONTRACT_EXPIRY_WARNING_DAYS
} from '../types/constants';

// ==============================|| TYPES ||============================== //

interface EmployeeTableHeaderProps {
  table: Table<Employee>;
  // CSV Export
  csvData: Employee[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: StatusFilter;
  onStatusFilterChange?: (status: StatusFilter) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
  // Actions
  onBulkDelete?: (selectedEmployees: Employee[]) => void;
  onExtendContract?: (selectedEmployees: Employee[]) => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<Employee>;
  statusFilter: StatusFilter;
  onStatusFilterChange?: (status: StatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();
  const tabColorMap = getStatusColorMap(theme);

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      active: allRows.filter((row) => row.original.status === 'active').length,
      inactive: allRows.filter((row) => row.original.status === 'inactive').length
    };
  }, [table]);

  const tabsConfig = useMemo(
    () => [
      { value: StatusFilter.ALL, label: 'Tất cả', count: statusCounts.all },
      {
        value: StatusFilter.ACTIVE,
        label: EMPLOYEE_STATUS_OPTIONS.find((opt) => opt.value === 'active')?.label || 'Đang làm',
        count: statusCounts.active
      },
      {
        value: StatusFilter.INACTIVE,
        label: EMPLOYEE_STATUS_OPTIONS.find((opt) => opt.value === 'inactive')?.label || 'Nghỉ việc',
        count: statusCounts.inactive
      }
    ],
    [statusCounts]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={(_, value) => onStatusFilterChange?.(value)}
        sx={{ '& .MuiTabs-indicator': { backgroundColor: tabColorMap[statusFilter], height: 3 } }}
      >
        {tabsConfig.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span>{tab.label}</span>
                <Box
                  component="span"
                  sx={{
                    minWidth: 20,
                    height: 20,
                    px: 0.75,
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: tabColorMap[tab.value] + '20',
                    color: tabColorMap[tab.value],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {tab.count}
                </Box>
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              '&.Mui-selected': { color: tabColorMap[tab.value] + ' !important' },
              '&:hover': { color: tabColorMap[tab.value] }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

// ==============================|| FILTER POPOVER ||============================== //

interface FilterPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
}

function FilterPopover({ open, onClose, anchorEl, columnFilters, onFilterChange }: FilterPopoverProps) {
  const { handleApply, handleReset, activeFilterCount } = useTableFilterDialog({
    columnFilters,
    onFilterChange,
    onClose,
    open
  });

  // Get current filter values
  const getFilterValue = (id: string) => {
    const filter = columnFilters.find((f) => f.id === id);
    return filter?.value as string | undefined;
  };

  const handleFilterChange = (id: string, value: string | number | boolean | undefined) => {
    const newFilters = columnFilters.filter((f) => f.id !== id);
    if (value !== undefined && value !== null && value !== '') {
      newFilters.push({ id, value });
    }
    onFilterChange(newFilters);
  };

  // Date range filter
  const getDateRangeFilter = (id: string) => {
    const filter = columnFilters.find((f) => f.id === id);
    const value = filter?.value as { start?: string; end?: string } | undefined;
    return value || { start: undefined, end: undefined };
  };

  const handleDateRangeChange = (id: string, start: string | undefined, end: string | undefined) => {
    const newFilters = columnFilters.filter((f) => f.id !== id);
    if (start || end) {
      newFilters.push({ id, value: { start, end } });
    }
    onFilterChange(newFilters);
  };

  const contractExpiryRange = getDateRangeFilter('contractExpiryDate');

  return (
    <Popper
      placement="bottom-end"
      open={open}
      anchorEl={anchorEl}
      transition
      disablePortal={false}
      popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
    >
      {({ TransitionProps }) => (
        <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
          <Paper
            elevation={8}
            sx={(theme) => ({
              boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.12)',
              width: { xs: 'calc(100vw - 32px)', sm: 800 },
              maxHeight: 'calc(100vh - 200px)',
              overflow: 'auto',
              borderRadius: 2
            })}
          >
            <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={onClose}>
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
                <Box sx={{ p: 2.5 }}>
                  <Grid container spacing={2}>
                    {/* Tên nhân sự */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Tên nhân sự"
                        value={getFilterValue('fullName') || ''}
                        onChange={(e) => handleFilterChange('fullName', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Mã nhân sự */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Mã nhân sự"
                        value={getFilterValue('code') || ''}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Bộ phận */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Bộ phận"
                        value={getFilterValue('department') || ''}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...DEPARTMENT_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Loại hợp đồng */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Loại hợp đồng"
                        value={getFilterValue('contractType') || ''}
                        onChange={(e) => handleFilterChange('contractType', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...CONTRACT_TYPE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Trạng thái */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Trạng thái"
                        value={getFilterValue('status') || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...EMPLOYEE_STATUS_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Thời hạn hợp đồng - Date Range */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>Thời hạn hợp đồng</Box>
                        <Stack direction="row" spacing={2}>
                          <DatePickerField
                            label="Từ ngày"
                            value={contractExpiryRange.start ? dayjs(contractExpiryRange.start) : null}
                            onChange={(value) => {
                              const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                              handleDateRangeChange('contractExpiryDate', dateStr, contractExpiryRange.end);
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'medium'
                              }
                            }}
                          />
                          <DatePickerField
                            label="Đến ngày"
                            value={contractExpiryRange.end ? dayjs(contractExpiryRange.end) : null}
                            onChange={(value) => {
                              const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                              handleDateRangeChange('contractExpiryDate', contractExpiryRange.start, dateStr);
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'medium'
                              }
                            }}
                          />
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
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
}

// ==============================|| MAIN COMPONENT ||============================== //

const EmployeeTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'employees',
  columnFilters,
  onFilterChange,
  statusFilter = StatusFilter.ALL,
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true,
  onBulkDelete,
  onExtendContract
}: EmployeeTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  // Check if any selected employees have contracts expiring soon
  const hasExpiringContracts = useMemo(() => {
    return selectedRows.some((row) => {
      const expiryDate = row.original.expiryDate;
      if (!expiryDate) return false;
      const expiry = dayjs(expiryDate);
      const now = dayjs();
      const daysUntilExpiry = expiry.diff(now, 'day');
      return daysUntilExpiry >= 0 && daysUntilExpiry <= CONTRACT_EXPIRY_WARNING_DAYS;
    });
  }, [selectedRows]);

  const handleCreateNew = () => {
    navigate(EMPLOYEE_URLS.NEW);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelection) {
      const selectedEmployees = selectedRows.map((row) => row.original);
      onBulkDelete(selectedEmployees);
    }
  };

  const handleExtendContract = () => {
    if (onExtendContract && hasExpiringContracts) {
      const expiringEmployees = selectedRows
        .filter((row) => {
          const expiryDate = row.original.expiryDate;
          if (!expiryDate) return false;
          const expiry = dayjs(expiryDate);
          const now = dayjs();
          const daysUntilExpiry = expiry.diff(now, 'day');
          return daysUntilExpiry >= 0 && daysUntilExpiry <= CONTRACT_EXPIRY_WARNING_DAYS;
        })
        .map((row) => row.original);
      onExtendContract(expiringEmployees);
    }
  };

  return (
    <>
      {/* Status Tabs */}
      <StatusTabs table={table} statusFilter={statusFilter} onStatusFilterChange={onStatusFilterChange} />

      {/* Toolbar */}
      <Toolbar
        sx={{
          p: 2
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <TextField
            placeholder="Tìm kiếm theo tên, mã nhân sự..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            size="medium"
            sx={{ minWidth: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }
            }}
          />

          {enableRowSelection && (
            <Box sx={{ minWidth: 120 }}>
              <RowSelection selected={selectedCount} />
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={intl.formatMessage({ id: 'filter' })}>
            <IconButton
              ref={filterAnchorRef}
              size="medium"
              color={columnFilters.length > 0 ? 'primary' : 'default'}
              onClick={filterPopover.onTrue}
              sx={{
                ...(columnFilters.length > 0 && {
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.primary.dark + 20 : theme.palette.primary.light)
                })
              }}
            >
              <FilterOutlined />
            </IconButton>
          </Tooltip>

          {enableCSVExport && csvData.length > 0 && <CSVExport data={csvData} filename={csvFilename} headers={csvHeadersData} />}

          {enableColumnVisibility && (
            <SelectColumnVisibility
              getVisibleLeafColumns={table.getVisibleLeafColumns}
              getIsAllColumnsVisible={table.getIsAllColumnsVisible}
              getToggleAllColumnsVisibilityHandler={table.getToggleAllColumnsVisibilityHandler}
              getAllColumns={table.getAllColumns}
            />
          )}

          {/* Gia hạn hợp đồng - Secondary, Conditional (when sắp hết hạn) */}
          {hasExpiringContracts && onExtendContract && (
            <Button variant="outlined" color="warning" startIcon={<PlusOutlined />} onClick={handleExtendContract}>
              Gia hạn hợp đồng (
              {
                selectedRows.filter((row) => {
                  const expiryDate = row.original.expiryDate;
                  if (!expiryDate) return false;
                  const expiry = dayjs(expiryDate);
                  const now = dayjs();
                  const daysUntilExpiry = expiry.diff(now, 'day');
                  return daysUntilExpiry >= 0 && daysUntilExpiry <= CONTRACT_EXPIRY_WARNING_DAYS;
                }).length
              }
              )
            </Button>
          )}

          {/* Xóa nhiều nhân sự - Secondary, Conditional (when ≥1 selected) */}
          {hasSelection && onBulkDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xóa nhiều ({selectedCount})
            </Button>
          )}

          {/* Thêm nhân sự - Primary, Always */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Thêm nhân sự
          </Button>
        </Stack>
      </Toolbar>

      {/* Filter Popover */}
      <FilterPopover
        open={filterPopover.value}
        onClose={filterPopover.onFalse}
        anchorEl={filterAnchorRef.current}
        columnFilters={columnFilters}
        onFilterChange={onFilterChange}
      />
    </>
  );
};

export default EmployeeTableHeader;
