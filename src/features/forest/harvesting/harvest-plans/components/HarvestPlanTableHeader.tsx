// ==============================|| HARVEST PLAN TABLE HEADER ||============================== //
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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ColumnFiltersState, Table } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

// project imports
import Transitions from 'components/@extended/Transitions';
import CheckboxField from 'components/fields/CheckboxField';
import DatePickerField from 'components/fields/DatePickerField';
import SelectField from 'components/fields/SelectField';
import TextField from 'components/fields/TextField';
import MainCard from 'components/MainCard';
import { CSVExport, RowSelection, SelectColumnVisibility } from 'components/third-party/react-table';
import { useTableFilterDialog } from 'hooks/table';
import useBoolean from 'hooks/useBoolean';
import dateHelper from 'utils/dateHelper';

import type { HarvestPlan } from '../types';
import {
  HARVEST_PLAN_STATUS,
  HARVEST_PLAN_STATUS_OPTIONS,
  HARVEST_PLAN_URLS,
  HarvestPlanStatusFilter,
  FOREST_AREA_OPTIONS
} from '../types/constants';

// ==============================|| TYPES ||============================== //

interface HarvestPlanTableHeaderProps {
  table: Table<HarvestPlan>;
  // CSV Export
  csvData: HarvestPlan[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: HarvestPlanStatusFilter;
  onStatusFilterChange?: (status: HarvestPlanStatusFilter) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
  // Actions
  onBulkDelete?: (selectedPlans: HarvestPlan[]) => void;
  onViewMap?: () => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<HarvestPlan>;
  statusFilter: HarvestPlanStatusFilter;
  onStatusFilterChange?: (status: HarvestPlanStatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  // Custom color map for harvest plan status
  const tabColorMap: Record<HarvestPlanStatusFilter, string> = {
    [HarvestPlanStatusFilter.ALL]: theme.palette.primary.main,
    [HarvestPlanStatusFilter.DRAFT]: theme.palette.grey[600],
    [HarvestPlanStatusFilter.ACTIVE]: theme.palette.success.main,
    [HarvestPlanStatusFilter.COMPLETED]: theme.palette.info.main
  };

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      draft: allRows.filter((row) => row.original.status === HARVEST_PLAN_STATUS.DRAFT).length,
      active: allRows.filter((row) => row.original.status === HARVEST_PLAN_STATUS.ACTIVE).length,
      completed: allRows.filter((row) => row.original.status === HARVEST_PLAN_STATUS.COMPLETED).length
    };
  }, [table]);

  const tabsConfig = useMemo(
    () => [
      { value: HarvestPlanStatusFilter.ALL, label: 'Tất cả', count: statusCounts.all },
      {
        value: HarvestPlanStatusFilter.DRAFT,
        label: HARVEST_PLAN_STATUS_OPTIONS.find((opt) => opt.value === HARVEST_PLAN_STATUS.DRAFT)?.label || 'Bản nháp',
        count: statusCounts.draft
      },
      {
        value: HarvestPlanStatusFilter.ACTIVE,
        label: HARVEST_PLAN_STATUS_OPTIONS.find((opt) => opt.value === HARVEST_PLAN_STATUS.ACTIVE)?.label || 'Đang thực hiện',
        count: statusCounts.active
      },
      {
        value: HarvestPlanStatusFilter.COMPLETED,
        label: HARVEST_PLAN_STATUS_OPTIONS.find((opt) => opt.value === HARVEST_PLAN_STATUS.COMPLETED)?.label || 'Hoàn thành',
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

  const startDate = getFilterValue('startDate') ? new Date(getFilterValue('startDate') as string) : null;
  const endDate = getFilterValue('endDate') ? new Date(getFilterValue('endDate') as string) : null;

  const handleStartDateChange = (date: Date | null) => {
    handleFilterChange('startDate', date ? date.toISOString() : undefined);
  };

  const handleEndDateChange = (date: Date | null) => {
    handleFilterChange('endDate', date ? date.toISOString() : undefined);
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ p: 2.5 }}>
                    <Grid container spacing={2}>
                      {/* Tên kế hoạch */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Tên kế hoạch"
                          value={getFilterValue('name') || ''}
                          onChange={(e) => handleFilterChange('name', e.target.value)}
                          fullWidth
                          size="medium"
                        />
                      </Grid>

                      {/* Mã kế hoạch */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="Mã kế hoạch"
                          value={getFilterValue('code') || ''}
                          onChange={(e) => handleFilterChange('code', e.target.value)}
                          fullWidth
                          size="medium"
                        />
                      </Grid>

                      {/* Khu vực rừng */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <SelectField
                          label="Khu vực rừng"
                          value={getFilterValue('forestAreaId') || ''}
                          onChange={(e) => handleFilterChange('forestAreaId', e.target.value)}
                          options={[{ value: '', label: 'Tất cả' }, ...FOREST_AREA_OPTIONS]}
                          fullWidth
                          size="medium"
                        />
                      </Grid>

                      {/* Trạng thái kế hoạch */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <SelectField
                          label="Trạng thái"
                          value={getFilterValue('status') || ''}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          options={[{ value: '', label: 'Tất cả' }, ...HARVEST_PLAN_STATUS_OPTIONS]}
                          fullWidth
                          size="medium"
                        />
                      </Grid>

                      {/* Thời gian khai thác (Date Range) */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <DatePickerField
                          label="Từ ngày"
                          value={dateHelper.normalizeDateValue(startDate)}
                          onChange={(newValue) => handleStartDateChange(newValue ? newValue.toDate() : null)}
                          slotProps={{ textField: { size: 'medium' } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <DatePickerField
                          label="Đến ngày"
                          value={dateHelper.normalizeDateValue(endDate)}
                          onChange={(newValue) => handleEndDateChange(newValue ? newValue.toDate() : null)}
                          slotProps={{ textField: { size: 'medium' } }}
                        />
                      </Grid>

                      {/* Chuẩn FSC */}
                      <Grid size={12}>
                        <Box>
                          <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>Chứng chỉ</Box>
                          <CheckboxField
                            label="Chuẩn FSC"
                            checked={getFilterValue('hasFSC') === 'true'}
                            onChange={(e) => handleFilterChange('hasFSC', e.target.checked ? 'true' : undefined)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </LocalizationProvider>
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

const HarvestPlanTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'harvest-plans',
  columnFilters,
  onFilterChange,
  statusFilter = HarvestPlanStatusFilter.ALL,
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true,
  onBulkDelete,
  onViewMap
}: HarvestPlanTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  const handleCreateNew = () => {
    navigate(HARVEST_PLAN_URLS.NEW);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelection) {
      const selectedPlans = selectedRows.map((row) => row.original);
      onBulkDelete(selectedPlans);
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
            placeholder="Tìm kiếm theo mã, tên vùng trồng..."
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

          {/* Xóa nhiều vùng - Secondary, Conditional (when ≥1 selected) */}
          {hasSelection && onBulkDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xóa nhiều vùng ({selectedCount})
            </Button>
          )}

          {/* Tạo vùng trồng - Primary, Always */}
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo vùng trồng
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

export default HarvestPlanTableHeader;
