// ==============================|| PAYROLL LIST PAGE ||============================== //

import EyeOutlined from '@ant-design/icons/EyeOutlined';
import {
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import PayrollTableHeader from '../components/PayrollTableHeader';
import { mockPayrolls } from '../mock/payrolls';
import type { Payroll, PayrollStatus } from '../types/index';

// ==============================|| PAYROLL LIST PAGE ||============================== //

const PayrollListPage = () => {
  const navigate = useNavigate();
  const [payrolls] = useState<Payroll[]>(mockPayrolls);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<PayrollStatus | 'all'>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  const getStatusColor = (status: Payroll['status']) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'calculated':
        return 'info';
      case 'approved':
        return 'warning';
      case 'paid':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Payroll['status']) => {
    switch (status) {
      case 'draft':
        return 'Nháp';
      case 'calculated':
        return 'Đã tính';
      case 'approved':
        return 'Đã duyệt';
      case 'paid':
        return 'Đã thanh toán';
      default:
        return status;
    }
  };

  const handleViewDetail = (id: string) => {
    navigate(`/timekeeping-payroll/payroll/${id}`);
  };

  // Filter payrolls
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((payroll) => {
      // Search filter
      const matchesSearch =
        !searchValue ||
        payroll.employeeCode.toLowerCase().includes(searchValue.toLowerCase()) ||
        payroll.employeeName.toLowerCase().includes(searchValue.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || payroll.status === statusFilter;

      // Period filter
      const matchesPeriod = periodFilter === 'all' || payroll.period === periodFilter;

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [payrolls, searchValue, statusFilter, periodFilter]);

  const handleExport = () => {
    // Mock export
    console.warn('Export payroll to Excel');
    alert('Xuất bảng lương ra Excel (Mock)');
  };

  return (
    <MainCard title="Danh sách bảng lương">
      {/* Table Header với StatusTabs ở đầu */}
      <PayrollTableHeader
        payrolls={payrolls}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        onExport={handleExport}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã NV</TableCell>
              <TableCell>Tên nhân viên</TableCell>
              <TableCell>Kỳ lương</TableCell>
              <TableCell align="right">Giờ công thường</TableCell>
              <TableCell align="right">Giờ tăng ca</TableCell>
              <TableCell align="right">Tổng giờ công</TableCell>
              <TableCell align="right">Lương cơ bản</TableCell>
              <TableCell align="right">Lương tăng ca</TableCell>
              <TableCell align="right">Tổng lương</TableCell>
              <TableCell align="right">Khấu trừ</TableCell>
              <TableCell align="right">Lương thực nhận</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayrolls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {payrolls.length === 0 ? 'Không có dữ liệu' : 'Không tìm thấy kết quả'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayrolls.map((payroll) => (
                <TableRow key={payroll.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {payroll.employeeCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payroll.employeeName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{payroll.period}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{payroll.regularHours}h</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{payroll.overtimeHours}h</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {payroll.totalHours}h
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{payroll.baseSalary.toLocaleString('vi-VN')} đ</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{payroll.overtimePay.toLocaleString('vi-VN')} đ</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {payroll.totalSalary.toLocaleString('vi-VN')} đ
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="error">
                      -{payroll.deductions.toLocaleString('vi-VN')} đ
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {payroll.netSalary.toLocaleString('vi-VN')} đ
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getStatusLabel(payroll.status)} color={getStatusColor(payroll.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="medium"
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(payroll.id);
                          }}
                          sx={{
                            '&:hover': {
                              bgcolor: 'info.lighter'
                            }
                          }}
                        >
                          <EyeOutlined />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default PayrollListPage;
