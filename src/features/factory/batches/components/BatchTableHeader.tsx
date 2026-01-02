// ==============================|| BATCH TABLE HEADER ||============================== //
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

import type { Batch, BatchStatus } from '../types';
import { BATCH_URLS, BATCH_STATUS_OPTIONS, PRODUCTION_ORDER_OPTIONS, PRODUCT_MATERIAL_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

export type BatchStatusFilter = 'all' | BatchStatus;

interface BatchTableHeaderProps {
  table: Table<Batch>;
  // CSV Export
  csvData: Batch[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: BatchStatusFilter;
  onStatusFilterChange?: (status: BatchStatusFilter) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Delete
  onBulkDelete?: (batches: Batch[]) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<Batch>;
  statusFilter: BatchStatusFilter;
  onStatusFilterChange?: (status: BatchStatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      'in-progress': allRows.filter((row) => row.original.status === 'in-progress').length,
      completed: allRows.filter((row) => row.original.status === 'completed').length,
      cancelled: allRows.filter((row) => row.original.status === 'cancelled').length
    };
  }, [table]);

  // Get color for each status - MUST be different for each status
  const getTabColor = (value: BatchStatusFilter) => {
    switch (value) {
      case 'all':
        return theme.palette.primary.main;
      case 'in-progress':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const tabsConfig = useMemo(
    () => [
      { value: 'all' as BatchStatusFilter, label: 'Tất cả', count: statusCounts.all },
      { value: 'in-progress' as BatchStatusFilter, label: 'Đang SX', count: statusCounts['in-progress'] },
      { value: 'completed' as BatchStatusFilter, label: 'Hoàn thành', count: statusCounts.completed },
      { value: 'cancelled' as BatchStatusFilter, label: 'Hủy', count: statusCounts.cancelled }
    ],
    [statusCounts]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={(_, value) => onStatusFilterChange?.(value as BatchStatusFilter)}
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
                    {/* Mã lô */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Mã lô"
                        value={getFilterValue('code') || ''}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Kế hoạch / Lệnh SX */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Kế hoạch / Lệnh SX"
                        value={getFilterValue('productionOrderId') || ''}
                        onChange={(e) => handleFilterChange('productionOrderId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...PRODUCTION_ORDER_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Sản phẩm / Nguyên liệu */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Sản phẩm / Nguyên liệu"
                        value={getFilterValue('productId') || ''}
                        onChange={(e) => handleFilterChange('productId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...PRODUCT_MATERIAL_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Trạng thái lô */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Trạng thái lô"
                        value={getFilterValue('status') || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...BATCH_STATUS_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Thời gian sản xuất - Date Range */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DatePickerField
                          label="Từ ngày"
                          value={dateHelper.normalizeDateValue(getFilterValue('startDateFrom') || null)}
                          onChange={(value) => {
                            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                            handleFilterChange('startDateFrom', dateStr);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'medium'
                            }
                          }}
                        />
                        <Box>-</Box>
                        <DatePickerField
                          label="Đến ngày"
                          value={dateHelper.normalizeDateValue(getFilterValue('startDateTo') || null)}
                          onChange={(value) => {
                            const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                            handleFilterChange('startDateTo', dateStr);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'medium'
                            }
                          }}
                        />
                      </Stack>
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

const BatchTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'batches',
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
}: BatchTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const handleCreateNew = () => {
    navigate(BATCH_URLS.NEW);
  };

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  const hasSelectedRows = selectedRows.length > 0;

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
            placeholder="Tìm kiếm theo mã lô..."
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
              <RowSelection selected={table.getFilteredSelectedRowModel().rows.length} />
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

          {hasSelectedRows && onBulkDelete && (
            <Tooltip title="Xóa nhiều lô sản xuất">
              <IconButton
                size="medium"
                color="error"
                onClick={() => onBulkDelete(selectedRows)}
                sx={{
                  '&:hover': {
                    bgcolor: 'error.lighter'
                  }
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          )}

          {enableCSVExport && csvData.length > 0 && <CSVExport data={csvData} filename={csvFilename} headers={csvHeadersData} />}

          {enableColumnVisibility && (
            <SelectColumnVisibility
              getVisibleLeafColumns={table.getVisibleLeafColumns}
              getIsAllColumnsVisible={table.getIsAllColumnsVisible}
              getToggleAllColumnsVisibilityHandler={table.getToggleAllColumnsVisibilityHandler}
              getAllColumns={table.getAllColumns}
            />
          )}

          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo lô sản xuất
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

export default BatchTableHeader;
