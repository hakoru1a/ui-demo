// ==============================|| LOGISTICS COST TABLE HEADER ||============================== //
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
import dateHelper from 'utils/dateHelper';

import {
  LOGISTICS_COSTING_URLS,
  COST_TYPE_OPTIONS,
  SERVICE_CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  CURRENCY_OPTIONS,
  PARTNER_OPTIONS
} from '../types/constants';
import type { LogisticsCostStatusFilter } from '../types/filters';
import type { LogisticsCost } from '../types/index';

// ==============================|| TYPES ||============================== //

interface LogisticsCostTableHeaderProps {
  table: Table<LogisticsCost>;
  // CSV Export
  csvData: LogisticsCost[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: LogisticsCostStatusFilter;
  onStatusFilterChange?: (status: LogisticsCostStatusFilter) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Actions
  onBulkDelete?: (costs: LogisticsCost[]) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<LogisticsCost>;
  statusFilter: LogisticsCostStatusFilter;
  onStatusFilterChange?: (status: LogisticsCostStatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      draft: allRows.filter((row) => row.original.status === 'draft').length,
      recorded: allRows.filter((row) => row.original.status === 'recorded').length
    };
  }, [table]);

  const tabsConfig = useMemo(
    () => [
      { value: 'all' as LogisticsCostStatusFilter, label: 'Tất cả', count: statusCounts.all },
      {
        value: 'draft' as LogisticsCostStatusFilter,
        label: STATUS_OPTIONS.find((opt) => opt.value === 'draft')?.label || 'Nháp',
        count: statusCounts.draft
      },
      {
        value: 'recorded' as LogisticsCostStatusFilter,
        label: STATUS_OPTIONS.find((opt) => opt.value === 'recorded')?.label || 'Đã ghi nhận',
        count: statusCounts.recorded
      }
    ],
    [statusCounts]
  );

  // Get color for each status tab - each status should have distinct color
  const getTabColor = (value: LogisticsCostStatusFilter) => {
    switch (value) {
      case 'all':
        return theme.palette.primary.main;
      case 'draft':
        return theme.palette.grey[600];
      case 'recorded':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={(_, value) => onStatusFilterChange?.(value as LogisticsCostStatusFilter)}
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

  // Get date range filter values
  const getDateRangeValue = (id: string) => {
    const filter = columnFilters.find((f) => f.id === id);
    return filter?.value as { start?: string; end?: string } | undefined;
  };

  const handleDateRangeChange = (id: string, start?: string, end?: string) => {
    const newFilters = columnFilters.filter((f) => f.id !== id);
    if (start || end) {
      newFilters.push({ id, value: { start, end } });
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
                    {/* Mã chi phí */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <TextField
                        label="Mã chi phí"
                        value={getFilterValue('costCode') || ''}
                        onChange={(e) => handleFilterChange('costCode', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Loại chi phí */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <SelectField
                        label="Loại chi phí"
                        value={getFilterValue('costType') || ''}
                        onChange={(e) => handleFilterChange('costType', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...COST_TYPE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Nhóm dịch vụ */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <SelectField
                        label="Nhóm dịch vụ"
                        value={getFilterValue('serviceCategory') || ''}
                        onChange={(e) => handleFilterChange('serviceCategory', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...SERVICE_CATEGORY_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Đối tác */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <SelectField
                        label="Đối tác"
                        value={getFilterValue('partnerId') || ''}
                        onChange={(e) => handleFilterChange('partnerId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...PARTNER_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Ngày phát sinh - Date Range */}
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                      <Box>
                        <Grid container spacing={1}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePickerField
                              label="Từ ngày"
                              value={
                                getDateRangeValue('costDate')?.start
                                  ? dateHelper.normalizeDateValue(getDateRangeValue('costDate')?.start || '')
                                  : null
                              }
                              onChange={(newValue) => {
                                const currentRange = getDateRangeValue('costDate') || {};
                                handleDateRangeChange('costDate', newValue ? dateHelper.formatDate(newValue) : undefined, currentRange.end);
                              }}
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
                              value={
                                getDateRangeValue('costDate')?.end
                                  ? dateHelper.normalizeDateValue(getDateRangeValue('costDate')?.end || '')
                                  : null
                              }
                              onChange={(newValue) => {
                                const currentRange = getDateRangeValue('costDate') || {};
                                handleDateRangeChange(
                                  'costDate',
                                  currentRange.start,
                                  newValue ? dateHelper.formatDate(newValue) : undefined
                                );
                              }}
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

                    {/* Tiền tệ */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <SelectField
                        label="Tiền tệ"
                        value={getFilterValue('currency') || ''}
                        onChange={(e) => handleFilterChange('currency', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...CURRENCY_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Trạng thái */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

const LogisticsCostTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'logistics-costs',
  columnFilters,
  onFilterChange,
  statusFilter = 'all',
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  onBulkDelete,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true
}: LogisticsCostTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  const handleCreateNew = () => {
    navigate(LOGISTICS_COSTING_URLS.NEW);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelection) {
      const selectedCosts = selectedRows.map((row) => row.original);
      onBulkDelete(selectedCosts);
    }
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.warn('Export Excel - Not implemented yet');
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.warn('Export PDF - Not implemented yet');
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
            placeholder="Tìm kiếm theo mã chi phí, đối tác..."
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

          {/* Export Excel */}
          <Tooltip title="Xuất Excel">
            <IconButton size="medium" color="success" onClick={handleExportExcel}>
              <FileExcelOutlined />
            </IconButton>
          </Tooltip>

          {/* Export PDF */}
          <Tooltip title="Xuất PDF">
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

          {/* Xóa nhiều chi phí - Secondary, Conditional (when ≥1 selected) */}
          {hasSelection && onBulkDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xóa nhiều chi phí ({selectedCount})
            </Button>
          )}

          {/* Thêm mới chi phí - Primary, Always */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Thêm mới chi phí
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

export default LogisticsCostTableHeader;
