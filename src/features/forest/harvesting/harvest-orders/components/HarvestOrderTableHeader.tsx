// ==============================|| HARVEST ORDER TABLE HEADER ||============================== //
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
import type { ColumnFiltersState, Table } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

// project imports
import Transitions from 'components/@extended/Transitions';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import { CSVExport, RowSelection, SelectColumnVisibility } from 'components/third-party/react-table';
import { useTableFilterDialog } from 'hooks/table';
import useBoolean from 'hooks/useBoolean';

import { HARVEST_ORDER_STATUS_OPTIONS, HARVEST_ORDER_URLS } from '../types/constants';
import { HARVEST_ORDER_STATUS } from '../types/enums';
import type { HarvestOrder } from '../types/index';

// ==============================|| TYPES ||============================== //

interface HarvestOrderTableHeaderProps {
  table: Table<HarvestOrder>;
  // CSV Export
  csvData: HarvestOrder[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: string;
  onStatusFilterChange?: (event: React.SyntheticEvent, newValue: string) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
  // Actions
  onBulkDelete?: (selectedOrders: HarvestOrder[]) => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<HarvestOrder>;
  statusFilter: string;
  onStatusFilterChange?: (event: React.SyntheticEvent, newValue: string) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  // Custom color map for harvest order status
  const tabColorMap: Record<string, string> = {
    all: theme.palette.primary.main,
    new: theme.palette.info.main,
    in_progress: theme.palette.warning.main,
    completed: theme.palette.success.main
  };

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      new: allRows.filter((row) => row.original.status === HARVEST_ORDER_STATUS.NEW).length,
      in_progress: allRows.filter((row) => row.original.status === HARVEST_ORDER_STATUS.IN_PROGRESS).length,
      completed: allRows.filter((row) => row.original.status === HARVEST_ORDER_STATUS.COMPLETED).length
    };
  }, [table]);

  const tabsConfig = useMemo(
    () => [
      { value: 'all', label: 'Tất cả', count: statusCounts.all },
      {
        value: HARVEST_ORDER_STATUS.NEW,
        label: HARVEST_ORDER_STATUS_OPTIONS.find((opt) => opt.value === HARVEST_ORDER_STATUS.NEW)?.label || 'Mới',
        count: statusCounts.new
      },
      {
        value: HARVEST_ORDER_STATUS.IN_PROGRESS,
        label: HARVEST_ORDER_STATUS_OPTIONS.find((opt) => opt.value === HARVEST_ORDER_STATUS.IN_PROGRESS)?.label || 'Đang khai thác',
        count: statusCounts.in_progress
      },
      {
        value: HARVEST_ORDER_STATUS.COMPLETED,
        label: HARVEST_ORDER_STATUS_OPTIONS.find((opt) => opt.value === HARVEST_ORDER_STATUS.COMPLETED)?.label || 'Hoàn thành',
        count: statusCounts.completed
      }
    ],
    [statusCounts]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={onStatusFilterChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="harvest order status tabs"
        sx={{ '& .MuiTabs-indicator': { backgroundColor: tabColorMap[statusFilter] || tabColorMap.all, height: 3 } }}
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
                    bgcolor: (tabColorMap[tab.value] || tabColorMap.all) + '20',
                    color: tabColorMap[tab.value] || tabColorMap.all,
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
              '&.Mui-selected': { color: (tabColorMap[tab.value] || tabColorMap.all) + ' !important' },
              '&:hover': { color: tabColorMap[tab.value] || tabColorMap.all }
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

  return (
    <Popper
      placement="bottom-end"
      open={open}
      anchorEl={anchorEl}
      transition
      disablePortal
      sx={{ zIndex: 1300 }}
      popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
    >
      {({ TransitionProps }) => (
        <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
          <Paper
            elevation={8}
            sx={(theme) => ({
              boxShadow: theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 8px 24px rgba(0, 0, 0, 0.12)',
              width: { xs: 'calc(100vw - 32px)', sm: 400 },
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
                {/* TODO: Add filter fields here based on HarvestOrderFilters type */}
                <Box sx={{ p: 2.5, minHeight: 100 }}>
                  <Box sx={{ color: 'text.secondary', textAlign: 'center' }}>Thêm các trường lọc tại đây</Box>
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

const HarvestOrderTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'harvest-orders',
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
}: HarvestOrderTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  const handleCreateNew = () => {
    navigate(HARVEST_ORDER_URLS.CREATE);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelection) {
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
            placeholder="Tìm kiếm theo mã lệnh, kế hoạch, khu vực..."
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

          {/* Xóa nhiều - Secondary, Conditional (when ≥1 selected) */}
          {hasSelection && onBulkDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xóa nhiều ({selectedCount})
            </Button>
          )}

          {/* Tạo lệnh khai thác - Primary, Always */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo lệnh khai thác
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

export default HarvestOrderTableHeader;
