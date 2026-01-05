// ==============================|| WORKFORCE DISPATCH ORDER TABLE HEADER ||============================== //
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
import { useMemo, useRef } from 'react';
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
import dateHelper from 'utils/dateHelper';

import type { DispatchOrderStatus, WorkforceDispatchOrder } from '../types';
import { WORKFORCE_DISPATCH_URLS, STATUS_OPTIONS, FACTORY_OPTIONS, PRODUCTION_SHIFT_OPTIONS, DEPARTMENT_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

export type StatusFilter = 'all' | DispatchOrderStatus;

interface WorkforceDispatchOrderTableHeaderProps {
  table: Table<WorkforceDispatchOrder>;
  // CSV Export
  csvData: WorkforceDispatchOrder[];
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
  onBulkDelete?: (selectedOrders: WorkforceDispatchOrder[]) => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<WorkforceDispatchOrder>;
  statusFilter: StatusFilter;
  onStatusFilterChange?: (status: StatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      draft: allRows.filter((row) => row.original.status === 'draft').length,
      approved: allRows.filter((row) => row.original.status === 'approved').length,
      applied: allRows.filter((row) => row.original.status === 'applied').length
    };
  }, [table]);

  const getTabColor = (value: StatusFilter) => {
    switch (value) {
      case 'all':
        return theme.palette.primary.main;
      case 'draft':
        return theme.palette.grey[600];
      case 'approved':
        return theme.palette.warning.main;
      case 'applied':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const tabsConfig = useMemo(
    () => [
      { value: 'all' as StatusFilter, label: 'Tất cả', count: statusCounts.all },
      {
        value: 'draft' as StatusFilter,
        label: STATUS_OPTIONS.find((opt) => opt.value === 'draft')?.label || 'Nháp',
        count: statusCounts.draft
      },
      {
        value: 'approved' as StatusFilter,
        label: STATUS_OPTIONS.find((opt) => opt.value === 'approved')?.label || 'Đã duyệt',
        count: statusCounts.approved
      },
      {
        value: 'applied' as StatusFilter,
        label: STATUS_OPTIONS.find((opt) => opt.value === 'applied')?.label || 'Đã áp dụng',
        count: statusCounts.applied
      }
    ],
    [statusCounts]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={(_, value) => onStatusFilterChange?.(value)}
        sx={{ '& .MuiTabs-indicator': { backgroundColor: getTabColor(statusFilter), height: 3 } }}
      >
        {tabsConfig.map((tab) => {
          const tabColor = getTabColor(tab.value);
          return (
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
                      bgcolor: tabColor + '20',
                      color: tabColor,
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
                '&.Mui-selected': { color: `${tabColor} !important` },
                '&:hover': { color: tabColor }
              }}
            />
          );
        })}
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

  const handleFilterChange = (id: string, value: string | undefined) => {
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

  const applicationDateRange = getDateRangeFilter('applicationDate');

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
              width: { xs: 'calc(100vw - 32px)', sm: 600 },
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
                    {/* Mã lệnh điều phối */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Mã lệnh điều phối"
                        value={getFilterValue('code') || ''}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Nhà máy */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        label="Nhà máy"
                        value={getFilterValue('factoryId') || ''}
                        onChange={(e) => handleFilterChange('factoryId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...FACTORY_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Ca sản xuất */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        label="Ca sản xuất"
                        value={getFilterValue('productionShiftId') || ''}
                        onChange={(e) => handleFilterChange('productionShiftId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...PRODUCTION_SHIFT_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Bộ phận */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        label="Bộ phận"
                        value={getFilterValue('departmentId') || ''}
                        onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...DEPARTMENT_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Ngày áp dụng */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePickerField
                        label="Ngày áp dụng từ"
                        value={applicationDateRange.start ? dateHelper.from(applicationDateRange.start) : null}
                        onChange={(value) => {
                          const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                          handleDateRangeChange('applicationDate', dateStr, applicationDateRange.end);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'medium'
                          }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePickerField
                        label="Ngày áp dụng đến"
                        value={applicationDateRange.end ? dateHelper.from(applicationDateRange.end) : null}
                        onChange={(value) => {
                          const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                          handleDateRangeChange('applicationDate', applicationDateRange.start, dateStr);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'medium'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button variant="outlined" color="secondary" onClick={handleReset}>
                      Đặt lại
                    </Button>
                    <Button variant="contained" onClick={handleApply}>
                      Áp dụng
                    </Button>
                  </Stack>
                </Box>
              </MainCard>
            </ClickAwayListener>
          </Paper>
        </Transitions>
      )}
    </Popper>
  );
}

// ==============================|| MAIN COMPONENT ||============================== //

const WorkforceDispatchOrderTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'workforce-dispatch-orders',
  columnFilters,
  onFilterChange,
  statusFilter = 'all',
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true,
  onBulkDelete
}: WorkforceDispatchOrderTableHeaderProps) => {
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  // Check if selected orders can be deleted (only draft status)
  const canDeleteSelected = useMemo(() => {
    return selectedRows.every((row) => row.original.status === 'draft');
  }, [selectedRows]);

  const handleCreateNew = () => {
    navigate(WORKFORCE_DISPATCH_URLS.NEW);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelection && canDeleteSelected) {
      const selectedOrders = selectedRows.map((row) => row.original);
      onBulkDelete(selectedOrders);
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
            placeholder="Tìm kiếm theo mã, nhà máy, bộ phận..."
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

          <Tooltip title="Bộ lọc">
            <IconButton ref={filterAnchorRef} onClick={filterPopover.onTrue} color={filterPopover.value ? 'primary' : 'default'}>
              <FilterOutlined />
            </IconButton>
          </Tooltip>

          {enableColumnVisibility && (
            <SelectColumnVisibility
              getVisibleLeafColumns={table.getVisibleLeafColumns}
              getIsAllColumnsVisible={table.getIsAllColumnsVisible}
              getToggleAllColumnsVisibilityHandler={table.getToggleAllColumnsVisibilityHandler}
              getAllColumns={table.getAllColumns}
            />
          )}

          {enableCSVExport && csvData.length > 0 && <CSVExport data={csvData} filename={csvFilename} headers={csvHeadersData} />}

          {enableRowSelection && hasSelection && canDeleteSelected && (
            <Tooltip title="Xóa nhiều">
              <IconButton color="error" onClick={handleBulkDelete}>
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          )}

          <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Thêm mới
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

export default WorkforceDispatchOrderTableHeader;
