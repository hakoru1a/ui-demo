// ==============================|| SKU TABLE HEADER ||============================== //
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
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import { CSVExport, RowSelection, SelectColumnVisibility } from 'components/third-party/react-table';
import { useTableFilterDialog } from 'hooks/table';
import useBoolean from 'hooks/useBoolean';
import { StatusFilter } from 'types/status';

import type { Sku } from '../types';
import { ITEM_TYPE_OPTIONS, SKU_URLS, STOCK_STATUS_OPTIONS, WAREHOUSE_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

interface SkuTableHeaderProps {
  table: Table<Sku>;
  // CSV Export
  csvData: Sku[];
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
  onBulkDelete?: (selectedSkus: Sku[]) => void;
  onExportExcel?: () => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<Sku>;
  statusFilter: StatusFilter | string;
  onStatusFilterChange?: (status: StatusFilter | string) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      in_stock: allRows.filter((row) => row.original.stockStatus === 'in_stock').length,
      out_of_stock: allRows.filter((row) => row.original.stockStatus === 'out_of_stock').length
    };
  }, [table]);

  // Get color for each status - MUST be different for each status
  const getTabColor = (value: StatusFilter | string) => {
    if (value === StatusFilter.ALL) return theme.palette.primary.main;
    if (value === 'in_stock') return theme.palette.success.main;
    if (value === 'out_of_stock') return theme.palette.error.main;
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
              <span>Còn hàng</span>
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: statusFilter === 'in_stock' ? `${getTabColor('in_stock')}20` : 'transparent',
                  color: statusFilter === 'in_stock' ? getTabColor('in_stock') : 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {statusCounts.in_stock}
              </Box>
            </Stack>
          }
          value="in_stock"
        />
        <Tab
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Hết hàng</span>
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: statusFilter === 'out_of_stock' ? `${getTabColor('out_of_stock')}20` : 'transparent',
                  color: statusFilter === 'out_of_stock' ? getTabColor('out_of_stock') : 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {statusCounts.out_of_stock}
              </Box>
            </Stack>
          }
          value="out_of_stock"
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
                    {/* SKU Code */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="SKU Code"
                        value={getFilterValue('code') || ''}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Tên hàng hóa */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Tên hàng hóa"
                        value={getFilterValue('name') || ''}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
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

                    {/* Kho */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Kho"
                        value={getFilterValue('warehouseId') || ''}
                        onChange={(e) => handleFilterChange('warehouseId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...WAREHOUSE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Trạng thái tồn */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Trạng thái tồn"
                        value={getFilterValue('stockStatus') || ''}
                        onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...STOCK_STATUS_OPTIONS]}
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

const SkuTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'skus',
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
}: SkuTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;
  const canBulkDelete = hasSelection;

  const handleViewDetail = () => {
    // When exactly 1 row is selected, navigate to detail page
    if (selectedCount === 1) {
      const selectedSku = selectedRows[0].original;
      navigate(SKU_URLS.DETAIL(selectedSku.id));
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && canBulkDelete) {
      const selectedSkus = selectedRows.map((row) => row.original);
      onBulkDelete(selectedSkus);
    }
  };

  const handleExportExcel = () => {
    onExportExcel?.();
  };

  const handleCreateNew = () => {
    navigate(SKU_URLS.NEW);
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
            placeholder="Tìm kiếm theo mã SKU, tên hàng hóa..."
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

          {/* Xem chi tiết SKU - Primary, Conditional (when 1 row selected) */}
          {selectedCount === 1 && (
            <Button variant="contained" color="primary" onClick={handleViewDetail}>
              Xem chi tiết SKU
            </Button>
          )}

          {/* Xóa nhiều - Secondary, Conditional (when ≥1 selected) */}
          {canBulkDelete && onBulkDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xóa ({selectedCount})
            </Button>
          )}

          {/* Tạo SKU mới - Primary, Always */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo SKU mới
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

export default SkuTableHeader;
