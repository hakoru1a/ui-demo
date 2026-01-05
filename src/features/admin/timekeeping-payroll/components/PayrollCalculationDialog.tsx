// ==============================|| PAYROLL CALCULATION DIALOG ||============================== //

import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

// project imports
import type { PayrollCalculationResult } from '../utils/salaryCalculator';

// ==============================|| TYPES ||============================== //

interface PayrollCalculationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  results: PayrollCalculationResult[];
  period: string;
  loading?: boolean;
}

// ==============================|| HELPER: FORMAT NUMBER ||============================== //

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

// ==============================|| PAYROLL CALCULATION DIALOG ||============================== //

const PayrollCalculationDialog = ({ open, onClose, onConfirm, results, period, loading = false }: PayrollCalculationDialogProps) => {
  const totalNetSalary = results.reduce((sum, r) => sum + r.netSalary, 0);
  const totalBaseSalary = results.reduce((sum, r) => sum + r.baseSalary, 0);
  const totalOvertimePay = results.reduce((sum, r) => sum + r.overtimePay, 0);
  const totalDeductions = results.reduce((sum, r) => sum + r.deductions, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CheckCircleOutlined style={{ fontSize: 24, color: 'var(--mui-palette-success-main)' }} />
          <Typography variant="h4">Kết quả tính lương</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Kỳ lương: <strong>{period}</strong> | Tổng số nhân viên: <strong>{results.length}</strong>
        </Typography>
      </DialogTitle>

      <DialogContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mã NV</TableCell>
                <TableCell>Tên nhân viên</TableCell>
                <TableCell align="right">Giờ công thường</TableCell>
                <TableCell align="right">Giờ tăng ca</TableCell>
                <TableCell align="right">Tổng giờ công</TableCell>
                <TableCell align="right">Lương cơ bản</TableCell>
                <TableCell align="right">Lương tăng ca</TableCell>
                <TableCell align="right">Tổng lương</TableCell>
                <TableCell align="right">Khấu trừ</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Lương thực nhận
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.employeeId} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {result.employeeCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{result.employeeName}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{result.regularHours}h</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{result.overtimeHours}h</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {result.totalHours}h
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatNumber(result.baseSalary)} đ</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatNumber(result.overtimePay)} đ</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatNumber(result.totalSalary)} đ
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="error">
                      -{formatNumber(result.deductions)} đ
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatNumber(result.netSalary)} đ
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

        {/* Summary */}
        <Stack spacing={1} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              Tổng lương cơ bản:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatNumber(totalBaseSalary)} đ
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              Tổng lương tăng ca:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatNumber(totalOvertimePay)} đ
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              Tổng khấu trừ:
            </Typography>
            <Typography variant="subtitle2" color="error" sx={{ fontWeight: 600 }}>
              -{formatNumber(totalDeductions)} đ
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tổng lương thực nhận:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
              {formatNumber(totalNetSalary)} đ
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit" disabled={loading} startIcon={<CloseOutlined />}>
          Đóng
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu bảng lương'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollCalculationDialog;
