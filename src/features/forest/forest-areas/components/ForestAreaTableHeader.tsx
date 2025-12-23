// material-ui
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { Box, IconButton, InputAdornment, Stack, Tab, Tabs, Toolbar, Tooltip, useTheme } from '@mui/material';
import type { ColumnFiltersState, Table } from '@tanstack/react-table';
import { useMemo } from 'react';

// third-party

// project imports
import { useIntl } from 'react-intl';

import TextField from 'components/fields/TextField';
import { CSVExport, RowSelection, SelectColumnVisibility } from 'components/third-party/react-table';
import { STATUS_OPTIONS, StatusFilter } from 'types/status';
import { getStatusColorMap } from 'utils/getStatusColor';

import ForestAreaFilter from './ForestAreaFilter';

// assets

// types

import { ForestArea } from '../types';

// ==============================|| FOREST AREA TABLE HEADER ||============================== //

interface ForestAreaTableHeaderProps {
  table: Table<ForestArea>;
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
  csvFilename?: string;
  csvData: ForestArea[];
  csvHeadersData: Array<{ label: string; key: string }>;
  columnFilters: ColumnFiltersState;
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  filterAnchorRef: React.RefObject<HTMLButtonElement | null>;
  onFilterChange: (filters: ColumnFiltersState) => void;
  statusFilter?: StatusFilter;
  onStatusFilterChange?: (status: StatusFilter) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const ForestAreaTableHeader = ({
  table,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true,
  csvFilename = 'forest-areas',
  csvData,
  csvHeadersData,
  columnFilters,
  filterDialogOpen,
  setFilterDialogOpen,
  filterAnchorRef,
  onFilterChange,
  statusFilter = StatusFilter.ALL,
  onStatusFilterChange,
  searchValue = '',
  onSearchChange
}: ForestAreaTableHeaderProps) => {
  const intl = useIntl();
  const theme = useTheme();
  const tabColorMap = getStatusColorMap(theme);

  // Count items by status (using pre-filtered data to get all items)
  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      active: allRows.filter((row) => row.original.status === 'active').length,
      inactive: allRows.filter((row) => row.original.status === 'inactive').length
    };
  }, [table]);

  // Tabs configuration
  const tabsConfig = useMemo(
    () => [
      {
        value: StatusFilter.ALL,
        labelKey: 'all',
        defaultLabel: 'Tất cả',
        count: statusCounts.all
      },
      {
        value: StatusFilter.ACTIVE,
        labelKey: 'active',
        defaultLabel: STATUS_OPTIONS.find((opt) => opt.value === 'active')?.label || 'Hoạt động',
        count: statusCounts.active
      },
      {
        value: StatusFilter.INACTIVE,
        labelKey: 'inactive',
        defaultLabel: STATUS_OPTIONS.find((opt) => opt.value === 'inactive')?.label || 'Tạm ngưng',
        count: statusCounts.inactive
      }
    ],
    [statusCounts]
  );

  const handleStatusTabChange = (_event: React.SyntheticEvent, value: StatusFilter) => {
    onStatusFilterChange?.(value);
  };

  return (
    <>
      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
        <Tabs
          value={statusFilter}
          onChange={handleStatusTabChange}
          aria-label="status tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: tabColorMap[statusFilter],
              height: 3
            }
          }}
        >
          {tabsConfig.map((tab) => (
            <Tab
              key={tab.value}
              label={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>{tab.defaultLabel}</span>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 20,
                      height: 20,
                      px: 0.75,
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      bgcolor: statusFilter === tab.value ? tabColorMap[tab.value] + '20' : 'action.hover',
                      color: statusFilter === tab.value ? tabColorMap[tab.value] : 'text.secondary'
                    }}
                  >
                    {tab.count}
                  </Box>
                </Box>
              }
              value={tab.value}
              sx={{
                textTransform: 'none',
                fontWeight: statusFilter === tab.value ? 600 : 400,
                '&.Mui-selected': {
                  color: tabColorMap[tab.value] + ' !important'
                },
                '&:hover': {
                  color: tabColorMap[tab.value]
                }
              }}
            />
          ))}
        </Tabs>
      </Box>

      <Toolbar
        sx={{
          p: 2,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(table.getFilteredSelectedRowModel().rows.length > 0 && {
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.primary.dark + 20 : theme.palette.primary.light)
          })
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          {/* Row Selection Badge */}
          {enableRowSelection && (
            <Box sx={{ position: 'relative' }}>
              <RowSelection selected={table.getFilteredSelectedRowModel().rows.length} />
            </Box>
          )}

          {/* Search Bar */}
          <TextField
            placeholder="Tìm kiếm theo mã, tên vùng trồng..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            size="medium"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Filter Button */}
          <Tooltip title={intl.formatMessage({ id: 'filter' })}>
            <IconButton
              ref={filterAnchorRef}
              size="medium"
              color={columnFilters.length > 0 ? 'primary' : 'default'}
              onClick={() => setFilterDialogOpen(true)}
              sx={{
                ...(columnFilters.length > 0 && {
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.primary.dark + 20 : theme.palette.primary.light)
                })
              }}
            >
              <FilterOutlined />
            </IconButton>
          </Tooltip>

          {/* CSV Export */}
          {enableCSVExport && csvData.length > 0 && <CSVExport data={csvData} filename={csvFilename} headers={csvHeadersData} />}

          {/* Column Visibility Control */}
          {enableColumnVisibility && (
            <SelectColumnVisibility
              getVisibleLeafColumns={table.getVisibleLeafColumns}
              getIsAllColumnsVisible={table.getIsAllColumnsVisible}
              getToggleAllColumnsVisibilityHandler={table.getToggleAllColumnsVisibilityHandler}
              getAllColumns={table.getAllColumns}
            />
          )}
        </Stack>
      </Toolbar>

      {/* Filter Popover */}
      <ForestAreaFilter
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        anchorEl={filterAnchorRef.current}
        table={table}
        columnFilters={columnFilters}
        onFilterChange={onFilterChange}
      />
    </>
  );
};

export default ForestAreaTableHeader;
