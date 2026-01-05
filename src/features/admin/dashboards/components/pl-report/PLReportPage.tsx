// ==============================|| P&L REPORT PAGE ||============================== //

import { FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useCallback, useMemo, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import PLReportFilterDrawer from './PLReportFilterDrawer';
import { mockPLReportData, mockProfitMargin, mockRevenueVsCost } from '../../mock/data';
import type { DashboardFilter } from '../../types';

const PLReportPage = () => {
  const filterDrawer = useBoolean(false);
  const [filter, setFilter] = useState<DashboardFilter>({
    startDate: null,
    endDate: null,
    factoryId: null,
    contractId: null,
    period: 'month'
  });

  const plData = useMemo(() => mockPLReportData, []);
  const revenueVsCostData = useMemo(() => mockRevenueVsCost, []);
  const profitMarginData = useMemo(() => mockProfitMargin, []);

  const handleExportExcel = useCallback(() => {
    const headers = ['Chỉ tiêu', 'Giá trị'];
    const rows = [
      ['Doanh thu', plData.revenue.toLocaleString('vi-VN')],
      ['Giá vốn', plData.costOfGoods.toLocaleString('vi-VN')],
      ['Lợi nhuận gộp', plData.grossProfit.toLocaleString('vi-VN')],
      ['Chi phí vận hành', plData.operatingExpenses.toLocaleString('vi-VN')],
      ['Lợi nhuận ròng', plData.netProfit.toLocaleString('vi-VN')]
    ];

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-pl-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [plData]);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" startIcon={<FileExcelOutlined />} onClick={handleExportExcel}>
          Export Excel
        </Button>
        <Button variant="outlined" startIcon={<FilePdfOutlined />} onClick={handleExportPDF}>
          Export PDF
        </Button>
        <Button variant="contained" startIcon={<FilterOutlined />} onClick={filterDrawer.onTrue}>
          Chọn bộ lọc
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* P&L Metrics Cards */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Doanh thu
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {plData.revenue.toLocaleString('vi-VN')} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Giá vốn
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {plData.costOfGoods.toLocaleString('vi-VN')} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Lợi nhuận gộp
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {plData.grossProfit.toLocaleString('vi-VN')} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Chi phí vận hành
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {plData.operatingExpenses.toLocaleString('vi-VN')} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Lợi nhuận ròng
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {plData.netProfit.toLocaleString('vi-VN')} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Doanh thu vs Chi phí" contentSX={{ p: 2 }}>
            {revenueVsCostData.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: 'band', data: revenueVsCostData.map((d) => d.period) }]}
                series={[
                  {
                    data: revenueVsCostData.map((d) => d.revenue),
                    label: 'Doanh thu',
                    color: '#1976d2'
                  },
                  {
                    data: revenueVsCostData.map((d) => d.cost),
                    label: 'Chi phí',
                    color: '#dc004e'
                  }
                ]}
                height={350}
                margin={{ left: 80, right: 30, top: 30, bottom: 50 }}
                slotProps={{
                  legend: {
                    position: { vertical: 'top', horizontal: 'center' }
                  }
                }}
                yAxis={[
                  {
                    valueFormatter: (value: number) => `${(value / 1000000).toFixed(0)}M`
                  }
                ]}
              />
            ) : (
              <Box sx={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</Box>
            )}
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Biên lợi nhuận" contentSX={{ p: 2 }}>
            {profitMarginData.length > 0 ? (
              <LineChart
                xAxis={[{ scaleType: 'band', data: profitMarginData.map((d) => d.period) }]}
                series={[
                  {
                    data: profitMarginData.map((d) => d.margin),
                    label: 'Biên lợi nhuận (%)',
                    color: '#2e7d32',
                    area: true,
                    showMark: true
                  }
                ]}
                height={350}
                margin={{ left: 60, right: 30, top: 30, bottom: 50 }}
                slotProps={{
                  legend: {
                    position: { vertical: 'top', horizontal: 'center' }
                  }
                }}
                yAxis={[
                  {
                    valueFormatter: (value: number) => `${value.toFixed(1)}%`
                  }
                ]}
              />
            ) : (
              <Box sx={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</Box>
            )}
          </MainCard>
        </Grid>
      </Grid>

      <PLReportFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default PLReportPage;
