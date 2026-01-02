// ==============================|| SHIFT LOG TABLE HEADER ||============================== //
// Combines: StatusTabs + Toolbar + FilterPopover

import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import FileExcelOutlined from '@ant-design/icons/FileExcelOutlined';
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
import { StatusFilter } from 'types/status';
import dateHelper from 'utils/dateHelper';

import type { ShiftLog } from '../types';
import { SHIFT_LOG_URLS, SHIFT_LOG_STATUS_OPTIONS, BATCH_OPTIONS, SHIFT_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

interface ShiftLogTableHeaderProps {
  table: Table<ShiftLog>;
  // CSV Export
  csvData: ShiftLog[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: StatusFilter | 'running' | 'completed';
  onStatusFilterChange?: (status: StatusFilter | 'running' | 'completed') => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
  // Custom actions
  onRecordLog?: () => void;
  onBackToCalendar?: () => void;
  onBulkDelete?: (selectedLogs: ShiftLog[]) => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<ShiftLog>;
  statusFilter: StatusFilter | 'running' | 'completed';
  onStatusFilterChange?: (status: StatusFilter | 'running' | 'completed') => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      running: allRows.filter((row) => row.original.status === 'running').length,
      completed: allRows.filter((row) => row.original.status === 'completed').length
    };
  }, [table]);

  // Get color for each status - MUST be different for each status
  const getTabColor = (value: string) => {
    switch (value) {
      case StatusFilter.ALL:
        return theme.palette.primary.main;
      case 'running':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const tabsConfig = useMemo(
    () => [
      { value: StatusFilter.ALL, label: 'Tất cả', count: statusCounts.all },
      {
        value: 'running' as StatusFilter,
        label: SHIFT_LOG_STATUS_OPTIONS.find((opt) => opt.value === 'running')?.label || 'Đang chạy',
        count: statusCounts.running
      },
      {
        value: 'completed' as StatusFilter,
        label: SHIFT_LOG_STATUS_OPTIONS.find((opt) => opt.value === 'completed')?.label || 'Kết thúc',
        count: statusCounts.completed
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
                '&.Mui-selected': { color: tabColor + ' !important' },
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
                    {/* Ca sản xuất */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Ca sản xuất"
                        value={getFilterValue('shiftId') || ''}
                        onChange={(e) => handleFilterChange('shiftId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...SHIFT_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Lô sản xuất */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Lô sản xuất"
                        value={getFilterValue('batchId') || ''}
                        onChange={(e) => handleFilterChange('batchId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...BATCH_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Ngày làm việc */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <DatePickerField
                        label="Ngày làm việc"
                        value={getFilterValue('workDate') ? dateHelper.normalizeDateValue(getFilterValue('workDate')) : null}
                        onChange={(value) => {
                          const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                          handleFilterChange('workDate', dateStr);
                        }}
                      />
                    </Grid>

                    {/* Trạng thái ca */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Trạng thái ca"
                        value={getFilterValue('status') || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...SHIFT_LOG_STATUS_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
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

const ShiftLogTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'shift-logs',
  columnFilters,
  onFilterChange,
  statusFilter = StatusFilter.ALL,
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true,
  onRecordLog,
  onBackToCalendar,
  onBulkDelete
}: ShiftLogTableHeaderProps) => {
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  // Get selected rows from table
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  // Check if there are any running shifts
  const hasRunningShifts = useMemo(() => {
    return table.getPreFilteredRowModel().rows.some((row) => row.original.status === 'running');
  }, [table]);

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelection) {
      const selectedLogs = selectedRows.map((row) => row.original);
      onBulkDelete(selectedLogs);
    }
  };

  const handleRecordLog = () => {
    if (onRecordLog) {
      onRecordLog();
    } else {
      navigate(SHIFT_LOG_URLS.NEW);
    }
  };

  const handleBackToCalendar = () => {
    if (onBackToCalendar) {
      onBackToCalendar();
    } else {
      navigate('/production-calendar');
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
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            size="small"
            sx={{ width: { xs: '100%', sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ flexGrow: 1 }} />

          {enableRowSelection && <RowSelection selected={selectedCount} />}

          {/* Bulk Delete Button - Only show when rows are selected */}
          {hasSelection && onBulkDelete && (
            <Tooltip title="Xóa các mục đã chọn">
              <IconButton color="error" onClick={handleBulkDelete} size="medium">
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Bộ lọc">
            <IconButton
              ref={filterAnchorRef}
              onClick={filterPopover.onToggle}
              color={filterPopover.value ? 'primary' : 'default'}
              size="medium"
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

          {/* Ghi nhận nhật ký - Conditional (only when shift is running) */}
          {hasRunningShifts && (
            <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleRecordLog}>
              Ghi nhận nhật ký
            </Button>
          )}

          {/* Export Excel */}
          <Button variant="outlined" startIcon={<FileExcelOutlined />} onClick={() => {}}>
            Export Excel
          </Button>

          {/* Quay lại lịch */}
          <Button variant="outlined" startIcon={<CalendarOutlined />} onClick={handleBackToCalendar}>
            Quay lại lịch
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

export default ShiftLogTableHeader;
