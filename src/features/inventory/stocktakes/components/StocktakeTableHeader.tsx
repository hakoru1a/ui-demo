// ==============================|| STOCKTAKE TABLE HEADER ||============================== //
// Combines: StatusTabs + Toolbar + FilterPopover

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

import type { Stocktake } from '../types';
import { STOCKTAKE_STATUS_OPTIONS, STOCKTAKE_URLS, WAREHOUSE_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

interface StocktakeTableHeaderProps {
  table: Table<Stocktake>;
  // CSV Export
  csvData: Stocktake[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: StatusFilter | string;
  onStatusFilterChange?: (status: StatusFilter | string) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
  // Actions
  onBulkDelete?: (selectedStocktakes: Stocktake[]) => void;
  onExportExcel?: () => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<Stocktake>;
  statusFilter: StatusFilter | string;
  onStatusFilterChange?: (status: StatusFilter | string) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      draft: allRows.filter((row) => row.original.status === 'draft').length,
      completed: allRows.filter((row) => row.original.status === 'completed').length
    };
  }, [table]);

  // Get color for each status - MUST be different for each status
  const getTabColor = (value: StatusFilter | string) => {
    if (value === StatusFilter.ALL) return theme.palette.primary.main;
    if (value === 'draft') return theme.palette.warning.main;
    if (value === 'completed') return theme.palette.success.main;
    return theme.palette.primary.main;
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: StatusFilter | string) => {
    onStatusFilterChange?.(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={handleChange}
        sx={{
          '& .MuiTab-root': {
            minHeight: 48,
            minWidth: 100
          },
          '& .MuiTabs-indicator': {
            backgroundColor: getTabColor(statusFilter)
          }
        }}
      >
        <Tab
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Tất cả</span>
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: statusFilter === StatusFilter.ALL ? `${getTabColor(StatusFilter.ALL)}20` : 'transparent',
                  color: statusFilter === StatusFilter.ALL ? getTabColor(StatusFilter.ALL) : 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {statusCounts.all}
              </Box>
            </Stack>
          }
          value={StatusFilter.ALL}
        />
        <Tab
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Nháp</span>
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: statusFilter === 'draft' ? `${getTabColor('draft')}20` : 'transparent',
                  color: statusFilter === 'draft' ? getTabColor('draft') : 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {statusCounts.draft}
              </Box>
            </Stack>
          }
          value="draft"
        />
        <Tab
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Hoàn tất</span>
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: statusFilter === 'completed' ? `${getTabColor('completed')}20` : 'transparent',
                  color: statusFilter === 'completed' ? getTabColor('completed') : 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {statusCounts.completed}
              </Box>
            </Stack>
          }
          value="completed"
        />
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

  // Date range filter handlers
  const getDateRangeValue = (id: string) => {
    const filter = columnFilters.find((f) => f.id === id);
    const value = filter?.value as string | undefined;
    if (!value) return null;
    // Parse date string to Date object for DatePicker
    try {
      return dateHelper.normalizeDateValue(value);
    } catch {
      return null;
    }
  };

  const handleDateRangeChange = (id: string, value: Date | null) => {
    const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
    handleFilterChange(id, dateStr);
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
                    {/* Mã phiếu kiểm kê */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Mã phiếu kiểm kê"
                        value={getFilterValue('code') || ''}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Kho */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        label="Kho"
                        value={getFilterValue('warehouseId') || ''}
                        onChange={(e) => handleFilterChange('warehouseId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...WAREHOUSE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Ngày kiểm kê - Date Range */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePickerField
                        label="Ngày kiểm kê từ"
                        value={getDateRangeValue('inventoryDateFrom')}
                        onChange={(value) => handleDateRangeChange('inventoryDateFrom', value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePickerField
                        label="Ngày kiểm kê đến"
                        value={getDateRangeValue('inventoryDateTo')}
                        onChange={(value) => handleDateRangeChange('inventoryDateTo', value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Trạng thái */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        label="Trạng thái"
                        value={getFilterValue('status') || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...STOCKTAKE_STATUS_OPTIONS]}
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

const StocktakeTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'stocktakes',
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
  onExportExcel
}: StocktakeTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;
  const canBulkDelete = hasSelection;

  const handleBulkDelete = () => {
    if (onBulkDelete && canBulkDelete) {
      const selectedStocktakes = selectedRows.map((row) => row.original);
      onBulkDelete(selectedStocktakes);
    }
  };

  const handleExportExcel = () => {
    onExportExcel?.();
  };

  const handleCreateNew = () => {
    navigate(STOCKTAKE_URLS.NEW);
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
            placeholder="Tìm kiếm theo mã phiếu, kho..."
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

          {/* Export Excel - Secondary, Always */}
          <Tooltip title="Export Excel">
            <IconButton size="medium" color="success" onClick={handleExportExcel}>
              <FileExcelOutlined />
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

          {/* Xóa nhiều - Secondary, Conditional (when ≥1 selected and status = draft) */}
          {canBulkDelete && onBulkDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xóa ({selectedCount})
            </Button>
          )}

          {/* Tạo phiếu kiểm kê - Primary, Always */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo phiếu kiểm kê
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

export default StocktakeTableHeader;
