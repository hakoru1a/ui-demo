// ==============================|| PAYROLL TABLE HEADER ||============================== //
// Combines: StatusTabs + Toolbar

import { FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  useTheme
} from '@mui/material';
import { useMemo } from 'react';

import type { Payroll, PayrollStatus } from '../types/index';

// ==============================|| TYPES ||============================== //

interface PayrollTableHeaderProps {
  payrolls: Payroll[];
  statusFilter: PayrollStatus | 'all';
  onStatusFilterChange: (status: PayrollStatus | 'all') => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (period: string) => void;
  onExport: () => void;
}

// ==============================|| STATUS TABS ||============================== //

interface StatusTabsProps {
  payrolls: Payroll[];
  statusFilter: PayrollStatus | 'all';
  onStatusFilterChange: (status: PayrollStatus | 'all') => void;
}

function StatusTabs({ payrolls, statusFilter, onStatusFilterChange }: StatusTabsProps) {
  const theme = useTheme();

  const statusCounts = useMemo(() => {
    return {
      all: payrolls.length,
      draft: payrolls.filter((p) => p.status === 'draft').length,
      calculated: payrolls.filter((p) => p.status === 'calculated').length,
      approved: payrolls.filter((p) => p.status === 'approved').length,
      paid: payrolls.filter((p) => p.status === 'paid').length
    };
  }, [payrolls]);

  const getTabColor = (value: PayrollStatus | 'all') => {
    switch (value) {
      case 'all':
        return theme.palette.primary.main;
      case 'draft':
        return theme.palette.grey[600];
      case 'calculated':
        return theme.palette.info.main;
      case 'approved':
        return theme.palette.warning.main;
      case 'paid':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const tabsConfig = useMemo(
    () => [
      { value: 'all' as const, label: 'Tất cả', count: statusCounts.all },
      { value: 'draft' as const, label: 'Nháp', count: statusCounts.draft },
      { value: 'calculated' as const, label: 'Đã tính', count: statusCounts.calculated },
      { value: 'approved' as const, label: 'Đã duyệt', count: statusCounts.approved },
      { value: 'paid' as const, label: 'Đã thanh toán', count: statusCounts.paid }
    ],
    [statusCounts]
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
      <Tabs
        value={statusFilter}
        onChange={(_, value) => onStatusFilterChange(value as PayrollStatus | 'all')}
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

// ==============================|| PAYROLL TABLE HEADER ||============================== //

const PayrollTableHeader = ({
  payrolls,
  statusFilter,
  onStatusFilterChange,
  searchValue,
  onSearchChange,
  periodFilter,
  onPeriodFilterChange,
  onExport
}: PayrollTableHeaderProps) => {
  // Get unique periods
  const periods = useMemo(() => {
    const uniquePeriods = new Set(payrolls.map((p) => p.period));
    return Array.from(uniquePeriods).sort().reverse();
  }, [payrolls]);

  return (
    <>
      {/* Status Tabs - Render ở đầu (trước Toolbar) */}
      <StatusTabs payrolls={payrolls} statusFilter={statusFilter} onStatusFilterChange={onStatusFilterChange} />

      {/* Toolbar */}
      <Toolbar sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <TextField
            size="medium"
            placeholder="Tìm kiếm theo mã/tên NV..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="medium" sx={{ minWidth: 150 }}>
            <InputLabel>Lọc theo kỳ</InputLabel>
            <Select value={periodFilter} label="Lọc theo kỳ" onChange={(e) => onPeriodFilterChange(e.target.value)}>
              <MenuItem value="all">Tất cả</MenuItem>
              {periods.map((period) => (
                <MenuItem key={period} value={period}>
                  {period}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ flexGrow: 1 }} />
          <Button size="medium" variant="outlined" startIcon={<FileTextOutlined />} onClick={onExport}>
            Export Excel
          </Button>
        </Stack>
      </Toolbar>
    </>
  );
};

export default PayrollTableHeader;
