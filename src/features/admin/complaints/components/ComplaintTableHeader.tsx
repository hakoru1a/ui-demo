// ==============================|| COMPLAINT TABLE HEADER ||============================== //

import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
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
import dayjs from 'dayjs';
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

import type { Complaint } from '../types';
import { COMPLAINT_URLS, COMPLAINT_TYPE_OPTIONS, COMPLAINT_STATUS_OPTIONS, EMPLOYEE_OPTIONS } from '../types/constants';

// ==============================|| TYPES ||============================== //

export type ComplaintStatusFilter = 'all' | 'new' | 'processing' | 'resolved';

interface ComplaintTableHeaderProps {
  table: Table<Complaint>;
  csvData: Complaint[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  statusFilter?: ComplaintStatusFilter;
  onStatusFilterChange?: (status: ComplaintStatusFilter) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
  onBulkDelete?: (selectedComplaints: Complaint[]) => void;
  onUpdateStatus?: (selectedComplaints: Complaint[]) => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<Complaint>;
  statusFilter: ComplaintStatusFilter;
  onStatusFilterChange?: (status: ComplaintStatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      new: allRows.filter((row) => row.original.status === 'new').length,
      processing: allRows.filter((row) => row.original.status === 'processing').length,
      resolved: allRows.filter((row) => row.original.status === 'resolved').length
    };
  }, [table]);

  const getTabColor = (value: ComplaintStatusFilter) => {
    switch (value) {
      case 'all':
        return theme.palette.primary.main;
      case 'new':
        return theme.palette.grey[600];
      case 'processing':
        return theme.palette.warning.main;
      case 'resolved':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const tabsConfig = useMemo(
    () => [
      { value: 'all' as ComplaintStatusFilter, label: 'Tất cả', count: statusCounts.all },
      {
        value: 'new' as ComplaintStatusFilter,
        label: COMPLAINT_STATUS_OPTIONS.find((opt) => opt.value === 'new')?.label || 'Mới',
        count: statusCounts.new
      },
      {
        value: 'processing' as ComplaintStatusFilter,
        label: COMPLAINT_STATUS_OPTIONS.find((opt) => opt.value === 'processing')?.label || 'Đang xử lý',
        count: statusCounts.processing
      },
      {
        value: 'resolved' as ComplaintStatusFilter,
        label: COMPLAINT_STATUS_OPTIONS.find((opt) => opt.value === 'resolved')?.label || 'Đã giải quyết',
        count: statusCounts.resolved
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

  const getDateRangeFilter = (id: string) => {
    const filter = columnFilters.find((f) => f.id === id);
    const value = filter?.value as { start?: string; end?: string } | undefined;
    return value || { start: undefined, end: undefined };
  };

  const handleDateRangeChange = (id: string, start: string | undefined, end: string | undefined) => {
    const newFilters = columnFilters.filter((f) => f.id !== id);
    if (start || end) {
      newFilters.push({ id, value: { start, end } });
    }
    onFilterChange(newFilters);
  };

  const receivedDateRange = getDateRangeFilter('receivedDate');

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
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Mã khiếu nại"
                        value={getFilterValue('code') || ''}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        fullWidth
                        size="medium"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        label="Nhân sự liên quan"
                        value={getFilterValue('relatedEmployeeId') || ''}
                        onChange={(e) => handleFilterChange('relatedEmployeeId', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...EMPLOYEE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        label="Loại khiếu nại"
                        value={getFilterValue('type') || ''}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...COMPLAINT_TYPE_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <SelectField
                        label="Trạng thái"
                        value={getFilterValue('status') || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[{ value: '', label: 'Tất cả' }, ...COMPLAINT_STATUS_OPTIONS]}
                        fullWidth
                        size="medium"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>Ngày tiếp nhận</Box>
                        <Stack direction="row" spacing={2}>
                          <DatePickerField
                            label="Từ ngày"
                            value={receivedDateRange.start ? dayjs(receivedDateRange.start) : null}
                            onChange={(value) => {
                              const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                              handleDateRangeChange('receivedDate', dateStr, receivedDateRange.end);
                            }}
                            fullWidth
                            size="medium"
                          />
                          <DatePickerField
                            label="Đến ngày"
                            value={receivedDateRange.end ? dayjs(receivedDateRange.end) : null}
                            onChange={(value) => {
                              const dateStr = value ? dateHelper.formatDate(value, 'YYYY-MM-DD') : undefined;
                              handleDateRangeChange('receivedDate', receivedDateRange.start, dateStr);
                            }}
                            fullWidth
                            size="medium"
                          />
                        </Stack>
                      </Box>
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

const ComplaintTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'complaints',
  columnFilters,
  onFilterChange,
  statusFilter = 'all',
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true,
  onBulkDelete,
  onUpdateStatus
}: ComplaintTableHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;
  const hasProcessingComplaints = selectedRows.some((row) => row.original.status === 'processing');

  const handleCreateNew = () => {
    navigate(COMPLAINT_URLS.NEW);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelection) {
      const selectedComplaints = selectedRows.map((row) => row.original);
      onBulkDelete(selectedComplaints);
    }
  };

  const handleUpdateStatus = () => {
    if (onUpdateStatus && hasProcessingComplaints) {
      const processingComplaints = selectedRows.filter((row) => row.original.status === 'processing').map((row) => row.original);
      onUpdateStatus(processingComplaints);
    }
  };

  const handleExportExcel = () => {
    // TODO: Call API to export Excel
    // await complaintService.exportExcel();
  };

  const handleExportPDF = () => {
    // TODO: Call API to export PDF
    // await complaintService.exportPDF();
  };

  return (
    <>
      <StatusTabs table={table} statusFilter={statusFilter} onStatusFilterChange={onStatusFilterChange} />
      <Toolbar sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <TextField
            placeholder="Tìm kiếm theo mã, người gửi..."
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

          <Tooltip title="Export Excel">
            <IconButton size="medium" color="success" onClick={handleExportExcel}>
              <FileExcelOutlined />
            </IconButton>
          </Tooltip>

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

          {hasProcessingComplaints && onUpdateStatus && (
            <Button variant="contained" color="primary" startIcon={<CheckCircleOutlined />} onClick={handleUpdateStatus}>
              Cập nhật trạng thái ({selectedRows.filter((row) => row.original.status === 'processing').length})
            </Button>
          )}

          {hasSelection && onBulkDelete && (
            <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xóa nhiều ({selectedCount})
            </Button>
          )}

          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleCreateNew}>
            Tạo khiếu nại
          </Button>
        </Stack>
      </Toolbar>

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

export default ComplaintTableHeader;
