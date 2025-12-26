// ==============================|| LEGAL CERTIFICATE TABLE HEADER ||============================== //

import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { Box, Button, InputAdornment, Stack, Tab, Tabs, Toolbar, useTheme } from '@mui/material';
import type { ColumnFiltersState, Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import TextField from 'components/fields/TextField';
import { CSVExport, RowSelection, SelectColumnVisibility } from 'components/third-party/react-table';

import type { LegalCertificate } from '../types';
import { LEGAL_CERTIFICATE_URLS, CERTIFICATE_STATUS_OPTIONS } from '../types';

// ==============================|| TYPES ||============================== //

export type CertificateStatusFilter = 'all' | 'active' | 'expiring_soon' | 'expired' | 'inactive';

interface LegalCertificateTableHeaderProps {
  table: Table<LegalCertificate>;
  // CSV Export
  csvData: LegalCertificate[];
  csvHeadersData: Array<{ label: string; key: string }>;
  csvFilename?: string;
  // Filter
  columnFilters: ColumnFiltersState;
  onFilterChange: (filters: ColumnFiltersState) => void;
  // Status
  statusFilter?: CertificateStatusFilter;
  onStatusFilterChange?: (status: CertificateStatusFilter) => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Feature flags
  enableRowSelection?: boolean;
  enableCSVExport?: boolean;
  enableColumnVisibility?: boolean;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  table: Table<LegalCertificate>;
  statusFilter: CertificateStatusFilter;
  onStatusFilterChange?: (status: CertificateStatusFilter) => void;
}

function StatusTabs({ table, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();
  const tabColorMap: Record<CertificateStatusFilter, string> = {
    all: theme.palette.primary.main,
    active: theme.palette.success.main,
    expiring_soon: theme.palette.warning.main,
    expired: theme.palette.error.main,
    inactive: theme.palette.grey[500]
  };

  const statusCounts = useMemo(() => {
    const allRows = table.getPreFilteredRowModel().rows;
    return {
      all: allRows.length,
      active: allRows.filter((row) => row.original.status === 'active').length,
      expiring_soon: allRows.filter((row) => row.original.status === 'expiring_soon').length,
      expired: allRows.filter((row) => row.original.status === 'expired').length,
      inactive: allRows.filter((row) => row.original.status === 'inactive').length
    };
  }, [table]);

  const tabsConfig = useMemo(
    () => [
      { value: 'all' as CertificateStatusFilter, label: 'Tất cả', count: statusCounts.all },
      {
        value: 'active' as CertificateStatusFilter,
        label: CERTIFICATE_STATUS_OPTIONS.find((opt) => opt.value === 'active')?.label || 'Còn hiệu lực',
        count: statusCounts.active
      },
      {
        value: 'expiring_soon' as CertificateStatusFilter,
        label: CERTIFICATE_STATUS_OPTIONS.find((opt) => opt.value === 'expiring_soon')?.label || 'Sắp hết hạn',
        count: statusCounts.expiring_soon
      },
      {
        value: 'expired' as CertificateStatusFilter,
        label: CERTIFICATE_STATUS_OPTIONS.find((opt) => opt.value === 'expired')?.label || 'Đã hết hạn',
        count: statusCounts.expired
      },
      {
        value: 'inactive' as CertificateStatusFilter,
        label: CERTIFICATE_STATUS_OPTIONS.find((opt) => opt.value === 'inactive')?.label || 'Không hoạt động',
        count: statusCounts.inactive
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

// ==============================|| MAIN COMPONENT ||============================== //

const LegalCertificateTableHeader = ({
  table,
  csvData,
  csvHeadersData,
  csvFilename = 'legal-certificates',
  columnFilters,
  onFilterChange,
  statusFilter = 'all',
  onStatusFilterChange,
  searchValue = '',
  onSearchChange,
  enableRowSelection = false,
  enableCSVExport = true,
  enableColumnVisibility = true
}: LegalCertificateTableHeaderProps) => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate(LEGAL_CERTIFICATE_URLS.NEW);
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
            placeholder="Tìm kiếm theo số chứng chỉ, tổ chức cấp..."
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
            Thêm chứng chỉ
          </Button>
        </Stack>
      </Toolbar>
    </>
  );
};

export default LegalCertificateTableHeader;
