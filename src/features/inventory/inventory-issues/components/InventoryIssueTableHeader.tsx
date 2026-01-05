// ==============================|| INVENTORY ISSUE TABLE HEADER ||============================== //
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

import { INVENTORY_ISSUE_URLS, ISSUE_TYPE_OPTIONS, ISSUE_STATUS_OPTIONS, WAREHOUSE_OPTIONS, CUSTOMER_OPTIONS } from '../types/constants';
import type { InventoryIssue } from '../types/index';

// ==============================|| TYPES ||============================== //

export enum IssueStatusFilter {
  ALL = 'all',
  DRAFT = 'draft',
  ISSUED = 'issued',
  CANCELLED = 'cancelled'
}

interface InventoryIssueTableHeaderProps {
  table: Table<InventoryIssue>;
  // CSV Export
  csvData: InventoryIssue[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: IssueStatusFilter;
  onStatusFilterChange?: (status: IssueStatusFilter) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
  // Bulk delete
  onBulkDelete?: (issues: InventoryIssue[]) => void;
  selectedRows?: InventoryIssue[];
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<InventoryIssue>;
  statusFilter: IssueStatusFilter;
  onStatusFilterChange?: (status: IssueStatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      draft: allRows.filter((row) => row.original.status === 'draft').length,
      issued: allRows.filter((row) => row.original.status === 'issued').length,
      cancelled: allRows.filter((row) => row.original.status === 'cancelled').length
    };
  }, [table]);

  const getTabColor = (value: IssueStatusFilter) => {
    switch (value) {
      case IssueStatusFilter.ALL:
        return theme.palette.primary.main;
      case IssueStatusFilter.DRAFT:
        return theme.palette.warning.main;
      case IssueStatusFilter.ISSUED:
        return theme.palette.success.main;
      case IssueStatusFilter.CANCELLED:
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const tabsConfig = useMemo(
    () => [
      { value: IssueStatusFilter.ALL, label: 'Tất cả', count: statusCounts.all },
      {
        value: IssueStatusFilter.DRAFT,
        label: ISSUE_STATUS_OPTIONS.find((opt) => opt.value === 'draft')?.label || 'Nháp',
        count: statusCounts.draft
      },
      {
        value: IssueStatusFilter.ISSUED,
        label: ISSUE_STATUS_OPTIONS.find((opt) => opt.value === 'issued')?.label || 'Đã xuất',
        count: statusCounts.issued
      },
      {
        value: IssueStatusFilter.CANCELLED,
        label: ISSUE_STATUS_OPTIONS.find((opt) => opt.value === 'cancelled')?.label || 'Hủy',
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
                    {/* Mã phiếu xuất */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        label="Mã phiếu xuất"
                        value={getFilterValue('code') || ''}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Loại xuất */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Loại xuất"
                        value={getFilterValue('issueType') || ''}
                        onChange={(e) => handleFilterChange('issueType', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...ISSUE_TYPE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Kho xuất */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Kho xuất"
                        value={getFilterValue('warehouseId') || ''}
                        onChange={(e) => handleFilterChange('warehouseId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...WAREHOUSE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Khách hàng / Đơn vị nhận */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Khách hàng / Đơn vị nhận"
                        value={getFilterValue('customerId') || ''}
                        onChange={(e) => handleFilterChange('customerId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...CUSTOMER_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>

                    {/* Ngày xuất - Date Range */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <DatePickerField
                        label="Ngày xuất từ"
                        value={getFilterValue('issueDateFrom') ? dateHelper.from(getFilterValue('issueDateFrom') as string) : null}
                        onChange={(value) => {
                          const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                          handleFilterChange('issueDateFrom', dateStr);
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <DatePickerField
                        label="Ngày xuất đến"
                        value={getFilterValue('issueDateTo') ? dateHelper.from(getFilterValue('issueDateTo') as string) : null}
                        onChange={(value) => {
                          const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                          handleFilterChange('issueDateTo', dateStr);
                        }}
                      />
                    </Grid>

                    {/* Trạng thái phiếu */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <SelectField
                        label="Trạng thái phiếu"
                        value={getFilterValue('status') || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...ISSUE_STATUS_OPTIONS]}
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

const InventoryIssueTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'inventory-issues',
  columnFilters,
  onFilterChange,
  statusFilter = IssueStatusFilter.ALL,
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true,
  onBulkDelete,
  selectedRows = []
}: InventoryIssueTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const handleCreateNew = () => {
    navigate(INVENTORY_ISSUE_URLS.NEW);
  };

  const handleBulkDeleteClick = () => {
    if (onBulkDelete && selectedRows.length > 0) {
      onBulkDelete(selectedRows);
    }
  };

  const canBulkDelete = selectedRows.length > 0 && selectedRows.every((row) => row.status === 'draft');

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
            placeholder="Tìm kiếm theo mã phiếu, kho xuất, khách hàng..."
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

          {enableCSVExport && csvData.length > 0 && (
            <>
              <Tooltip title="Export Excel">
                <IconButton size="medium" color="success">
                  <FileExcelOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export PDF">
                <IconButton size="medium" color="error">
                  <FilePdfOutlined />
                </IconButton>
              </Tooltip>
              <CSVExport data={csvData} filename={csvFilename} headers={csvHeadersData} />
            </>
          )}

          {enableColumnVisibility && (
            <SelectColumnVisibility
              getVisibleLeafColumns={table.getVisibleLeafColumns}
              getIsAllColumnsVisible={table.getIsAllColumnsVisible}
              getToggleAllColumnsVisibilityHandler={table.getToggleAllColumnsVisibilityHandler}
              getAllColumns={table.getAllColumns}
            />
          )}

          {onBulkDelete && canBulkDelete && (
            <Tooltip title="Xóa nhiều phiếu">
              <IconButton size="medium" color="error" onClick={handleBulkDeleteClick}>
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          )}

          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo phiếu xuất
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

export default InventoryIssueTableHeader;
