// ==============================|| PAYROLL DETAIL PAGE ||============================== //

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Alert, Box, Button, Chip, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';

import { getMockPayroll } from '../mock/payrolls';
import type { Payroll } from '../types/index';

// ==============================|| PAYROLL DETAIL PAGE ||============================== //

const PayrollDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Payroll | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id) {
        const found = getMockPayroll(id);
        if (found) {
          setData(found);
        } else {
          setError('Không tìm thấy bảng lương');
        }
      }

      setIsLoading(false);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/timekeeping-payroll/payroll');
  };

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

  if (isLoading) {
    return (
      <MainCard>
        <CircularLoader />
      </MainCard>
    );
  }

  if (error || !data) {
    return (
      <MainCard>
        <Stack spacing={2}>
          <Alert severity="error">{error || 'Không tìm thấy bảng lương'}</Alert>
          <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Chi tiết bảng lương"
      secondary={
        <Button variant="outlined" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại
        </Button>
      }
    >
      <Grid container spacing={3}>
        {/* Thông tin nhân viên */}
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin nhân viên
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Mã nhân viên
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {data.employeeCode}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Tên nhân viên
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {data.employeeName}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Kỳ lương
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {data.period}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Trạng thái
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            <Chip label={getStatusLabel(data.status)} color={getStatusColor(data.status)} />
          </Box>
        </Grid>

        {/* Thông tin giờ công */}
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
            Thông tin giờ công
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Giờ công thường
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {data.regularHours} giờ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Giờ tăng ca
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {data.overtimeHours} giờ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng giờ công
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {data.totalHours} giờ
          </Typography>
        </Grid>

        {/* Thông tin lương */}
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
            Thông tin lương
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Lương cơ bản
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {data.baseSalary.toLocaleString('vi-VN')} đ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Lương tăng ca
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {data.overtimePay.toLocaleString('vi-VN')} đ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng lương
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {data.totalSalary.toLocaleString('vi-VN')} đ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Các khoản khấu trừ
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'error.main' }}>
            -{data.deductions.toLocaleString('vi-VN')} đ
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Lương thực nhận
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
            {data.netSalary.toLocaleString('vi-VN')} đ
          </Typography>
        </Grid>

        {/* Ghi chú */}
        {data.notes && (
          <>
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
                Ghi chú
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2">{data.notes}</Typography>
            </Grid>
          </>
        )}
      </Grid>
    </MainCard>
  );
};

export default PayrollDetailPage;
