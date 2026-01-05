// ==============================|| TRANSFER TABLE HEADER ||============================== //
// Combines: StatusTabs + Toolbar + FilterPopover

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import FileExcelOutlined from '@ant-design/icons/FileExcelOutlined';
import FilePdfOutlined from '@ant-design/icons/FilePdfOutlined';
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
import { useMemo, useRef, useState } from 'react';
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

import type { Transfer } from '../types';
import { ITEM_TYPE_OPTIONS, STATUS_OPTIONS, TRANSFER_URLS, WAREHOUSE_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

interface TransferTableHeaderProps {
  table: Table<Transfer>;
  // CSV Export
  csvData: Transfer[];
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
  onBulkDelete?: (selectedTransfers: Transfer[]) => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<Transfer>;
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
      transferred: allRows.filter((row) => row.original.status === 'transferred').length,
      cancelled: allRows.filter((row) => row.original.status === 'cancelled').length
    };
  }, [table]);

  // Get color for each status - MUST be different for each status
  const getTabColor = (value: StatusFilter | string) => {
    if (value === StatusFilter.ALL) return theme.palette.primary.main;
    if (value === 'transferred') return theme.palette.success.main;
    if (value === 'draft') return theme.palette.warning.main;
    if (value === 'cancelled') return theme.palette.error.main;
    return theme.palette.primary.main;
  };

  const tabsConfig = useMemo(
    () => [
      { value: StatusFilter.ALL, label: 'Tất cả', count: statusCounts.all },
      {
        value: 'draft' as StatusFilter | string,
        label: STATUS_OPTIONS.find((opt) => opt.value === 'draft')?.label || 'Nháp',
        count: statusCounts.draft
      },
      {
        value: 'transferred' as StatusFilter | string,
        label: STATUS_OPTIONS.find((opt) => opt.value === 'transferred')?.label || 'Đã chuyển',
        count: statusCounts.transferred
      },
      {
        value: 'cancelled' as StatusFilter | string,
        label: STATUS_OPTIONS.find((opt) => opt.value === 'cancelled')?.label || 'Hủy',
        count: statusCounts.cancelled
      }
    ],
    [statusCounts]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={(_, value) => onStatusFilterChange?.(value)}
        sx={{ '& .MuiTabs-indicator': { backgroundColor: getTabColor(statusFilter as StatusFilter | string), height: 3 } }}
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

  // Get current filter values
  const getFilterValue = (id: string) => {
    const filter = columnFilters.find((f) => f.id === id);
    return filter?.value as string | undefined;
  };

  // Get date range value
  const getDateRangeValue = (id: string) => {
    const filter = columnFilters.find((f) => f.id === id);
    if (filter?.value && typeof filter.value === 'object' && 'start' in filter.value && 'end' in filter.value) {
      return filter.value as { start?: string; end?: string };
    }
    return undefined;
  };

  const handleFilterChange = (id: string, value: string | number | boolean | undefined) => {
    const newFilters = columnFilters.filter((f) => f.id !== id);
    if (value !== undefined && value !== null && value !== '') {
      newFilters.push({ id, value });
    }
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (id: string, start?: string, end?: string) => {
    const newFilters = columnFilters.filter((f) => f.id !== id);
    if (start || end) {
      newFilters.push({ id, value: { start, end } });
    }
    onFilterChange(newFilters);
  };

  // Date range state for transfer date
  const transferDateRange = getDateRangeValue('transferDate') || {};
  const [transferStartDate, setTransferStartDate] = useState<Date | null>(
    transferDateRange.start ? new Date(transferDateRange.start) : null
  );
  const [transferEndDate, setTransferEndDate] = useState<Date | null>(transferDateRange.end ? new Date(transferDateRange.end) : null);

  const handleTransferStartDateChange = (value: Date | null) => {
    setTransferStartDate(value);
    const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
    handleDateRangeChange('transferDate', dateStr, transferDateRange.end);
  };

  const handleTransferEndDateChange = (value: Date | null) => {
    setTransferEndDate(value);
    const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
    handleDateRangeChange('transferDate', transferDateRange.start, dateStr);
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
                    {/* Mã phiếu chuyển */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Mã phiếu chuyển"
                        value={getFilterValue('code') || ''}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Kho nguồn */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Kho nguồn"
                        value={getFilterValue('sourceWarehouseId') || ''}
                        onChange={(e) => handleFilterChange('sourceWarehouseId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...WAREHOUSE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Kho đích */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Kho đích"
                        value={getFilterValue('destinationWarehouseId') || ''}
                        onChange={(e) => handleFilterChange('destinationWarehouseId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...WAREHOUSE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Loại hàng */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Loại hàng"
                        value={getFilterValue('itemType') || ''}
                        onChange={(e) => handleFilterChange('itemType', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...ITEM_TYPE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Ngày chuyển - Date Range */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Grid container spacing={1}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePickerField
                              label="Từ ngày"
                              value={transferStartDate ? dateHelper.normalizeDateValue(transferStartDate) : null}
                              onChange={(newValue) => handleTransferStartDateChange(newValue ? newValue.toDate() : null)}
                              format="DD/MM/YYYY"
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'medium' as 'small' | 'medium'
                                }
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePickerField
                              label="Đến ngày"
                              value={transferEndDate ? dateHelper.normalizeDateValue(transferEndDate) : null}
                              onChange={(newValue) => handleTransferEndDateChange(newValue ? newValue.toDate() : null)}
                              format="DD/MM/YYYY"
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'medium' as 'small' | 'medium'
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>

                    {/* Trạng thái */}
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <SelectField
                        label="Trạng thái"
                        value={getFilterValue('status') || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...STATUS_OPTIONS]}
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

const TransferTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'transfers',
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
  onExportExcel,
  onExportPDF
}: TransferTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;
  // Only draft transfers can be bulk deleted
  const canBulkDelete = hasSelection && selectedRows.every((row) => row.original.status === 'draft');

  const handleCreateNew = () => {
    navigate(TRANSFER_URLS.NEW);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && canBulkDelete) {
      const selectedTransfers = selectedRows.map((row) => row.original);
      onBulkDelete(selectedTransfers);
    }
  };

  const handleExportExcel = () => {
    onExportExcel?.();
  };

  const handleExportPDF = () => {
    onExportPDF?.();
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
            placeholder="Tìm kiếm theo mã phiếu, kho nguồn, kho đích..."
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

          {/* Export PDF - Secondary, Always */}
          <Tooltip title="Export PDF">
            <IconButton size="medium" color="error" onClick={handleExportPDF}>
              <FilePdfOutlined />
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

          {/* Xóa nhiều phiếu - Secondary, Conditional (when ≥1 selected & status = draft) */}
          {canBulkDelete && onBulkDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleBulkDelete}>
              ({selectedCount})
            </Button>
          )}

          {/* Tạo phiếu chuyển kho - Primary, Always */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo phiếu chuyển kho
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

export default TransferTableHeader;
