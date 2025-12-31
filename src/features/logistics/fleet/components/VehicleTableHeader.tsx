// ==============================|| VEHICLE TABLE HEADER ||============================== //
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
import CheckboxField from 'components/fields/CheckboxField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import { CSVExport, RowSelection, SelectColumnVisibility } from 'components/third-party/react-table';
import { useTableFilterDialog } from 'hooks/table';
import useBoolean from 'hooks/useBoolean';

import type { Vehicle } from '../types';
import { DRIVER_STATUS_OPTIONS, FLEET_URLS, VEHICLE_STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

export type VehicleStatusFilter = 'all' | 'ready' | 'running' | 'maintenance';

interface VehicleTableHeaderProps {
  table: Table<Vehicle>;
  // CSV Export
  csvData: Vehicle[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: VehicleStatusFilter;
  onStatusFilterChange?: (status: VehicleStatusFilter) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Delete
  selectedRows?: Vehicle[];
  onBulkDelete?: (vehicles: Vehicle[]) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<Vehicle>;
  statusFilter: VehicleStatusFilter;
  onStatusFilterChange?: (status: VehicleStatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      ready: allRows.filter((row) => row.original.vehicleStatus === 'ready').length,
      running: allRows.filter((row) => row.original.vehicleStatus === 'running').length,
      maintenance: allRows.filter((row) => row.original.vehicleStatus === 'maintenance').length
    };
  }, [table]);

  const tabsConfig = useMemo(
    () => [
      { value: 'all' as VehicleStatusFilter, label: 'Tất cả', count: statusCounts.all },
      {
        value: 'ready' as VehicleStatusFilter,
        label: VEHICLE_STATUS_OPTIONS.find((opt) => opt.value === 'ready')?.label || 'Sẵn sàng',
        count: statusCounts.ready
      },
      {
        value: 'running' as VehicleStatusFilter,
        label: VEHICLE_STATUS_OPTIONS.find((opt) => opt.value === 'running')?.label || 'Đang chạy',
        count: statusCounts.running
      },
      {
        value: 'maintenance' as VehicleStatusFilter,
        label: VEHICLE_STATUS_OPTIONS.find((opt) => opt.value === 'maintenance')?.label || 'Bảo trì',
        count: statusCounts.maintenance
      }
    ],
    [statusCounts]
  );

  // Get color for each status tab - each status should have distinct color
  const getTabColor = (value: VehicleStatusFilter) => {
    switch (value) {
      case 'all':
        return theme.palette.primary.main;
      case 'ready':
        return theme.palette.success.main;
      case 'running':
        return theme.palette.info.main;
      case 'maintenance':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={(_, value) => onStatusFilterChange?.(value as VehicleStatusFilter)}
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
                    {/* Biển số xe */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Biển số xe"
                        value={getFilterValue('licensePlate') || ''}
                        onChange={(e) => handleFilterChange('licensePlate', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Tên tài xế */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Tên tài xế"
                        value={getFilterValue('driverName') || ''}
                        onChange={(e) => handleFilterChange('driverName', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Loại xe */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Loại xe"
                        value={getFilterValue('vehicleType') || ''}
                        onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...VEHICLE_TYPE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Trạng thái xe */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Trạng thái xe"
                        value={getFilterValue('vehicleStatus') || ''}
                        onChange={(e) => handleFilterChange('vehicleStatus', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...VEHICLE_STATUS_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Trạng thái tài xế */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Trạng thái tài xế"
                        value={getFilterValue('driverStatus') || ''}
                        onChange={(e) => handleFilterChange('driverStatus', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...DRIVER_STATUS_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Hiệu lực GPLX */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <CheckboxField
                        label="Còn hạn"
                        checked={getFilterValue('licenseValid') === 'true'}
                        onChange={(e) => handleFilterChange('licenseValid', e.target.checked ? 'true' : undefined)}
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

const VehicleTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'fleet-export',
  columnFilters,
  onFilterChange,
  statusFilter = 'all',
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  selectedRows = [],
  onBulkDelete,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true
}: VehicleTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const handleCreateNew = () => {
    navigate(FLEET_URLS.NEW);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length > 0 && onBulkDelete) {
      onBulkDelete(selectedRows);
    }
  };

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
            placeholder="Tìm kiếm theo biển số, tên tài xế..."
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

          {enableCSVExport && csvData.length > 0 && <CSVExport data={csvData} filename={csvFilename} headers={csvHeadersData} />}

          {enableColumnVisibility && (
            <SelectColumnVisibility
              getVisibleLeafColumns={table.getVisibleLeafColumns}
              getIsAllColumnsVisible={table.getIsAllColumnsVisible}
              getToggleAllColumnsVisibilityHandler={table.getToggleAllColumnsVisibilityHandler}
              getAllColumns={table.getAllColumns}
            />
          )}

          {hasSelectedRows && onBulkDelete && (
            <Tooltip title={`Xóa ${selectedRows.length} xe đã chọn`}>
              <IconButton
                size="medium"
                color="error"
                onClick={handleBulkDelete}
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

          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Thêm xe & tài xế
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

export default VehicleTableHeader;
