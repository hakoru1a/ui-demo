// ==============================|| RECEIPT ISSUE REPORT PAGE ||============================== //

import { FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import { Box, Button, Chip, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useCallback, useMemo, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import ReceiptIssueReportFilterDrawer from './ReceiptIssueReportFilterDrawer';
import { mockInboundVsOutbound, mockInventoryTurnover, mockReceiptIssueReportItems } from '../../mock/data';
import type { DashboardFilter } from '../../types';

const ReceiptIssueReportPage = () => {
  const filterDrawer = useBoolean(false);
  const [filter, setFilter] = useState<DashboardFilter>({
    startDate: null,
    endDate: null,
    warehouseId: null,
    transactionType: null
  });

  const reportItems = useMemo(() => mockReceiptIssueReportItems, []);
  const inboundVsOutboundData = useMemo(() => mockInboundVsOutbound, []);
  const inventoryTurnoverData = useMemo(() => mockInventoryTurnover, []);

  const handleExportExcel = useCallback(() => {
    const headers = ['Ngày', 'Mã phiếu', 'Loại', 'SKU', 'Khối lượng', 'Đối tác'];
    const rows = reportItems.map((item) => [
      item.date,
      item.documentCode,
      item.type === 'inbound' ? 'Nhập' : 'Xuất',
      item.sku,
      item.quantity.toString(),
      item.partner
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-nhap-xuat-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [reportItems]);

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
        {/* Report Table */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Báo cáo nhập / xuất hàng" contentSX={{ p: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Mã phiếu</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Khối lượng</TableCell>
                  <TableCell>Đối tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportItems.map((item) => (
                  <TableRow key={item.documentCode}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.documentCode}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.type === 'inbound' ? 'Nhập' : 'Xuất'}
                        size="small"
                        color={item.type === 'inbound' ? 'success' : 'warning'}
                        variant="light"
                      />
                    </TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell align="right">{item.quantity.toLocaleString('vi-VN')}</TableCell>
                    <TableCell>{item.partner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </MainCard>
        </Grid>

        {/* Charts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Nhập vs Xuất" contentSX={{ p: 2 }}>
            {inboundVsOutboundData.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: 'band', data: inboundVsOutboundData.map((d) => d.date) }]}
                series={[
                  {
                    data: inboundVsOutboundData.map((d) => d.inbound),
                    label: 'Nhập',
                    color: '#2e7d32'
                  },
                  {
                    data: inboundVsOutboundData.map((d) => d.outbound),
                    label: 'Xuất',
                    color: '#ed6c02'
                  }
                ]}
                height={350}
                margin={{ left: 60, right: 30, top: 30, bottom: 50 }}
                slotProps={{
                  legend: {
                    position: { vertical: 'top', horizontal: 'center' }
                  }
                }}
              />
            ) : (
              <Box sx={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</Box>
            )}
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Xu hướng luân chuyển" contentSX={{ p: 2 }}>
            {inventoryTurnoverData.length > 0 ? (
              <LineChart
                xAxis={[{ scaleType: 'band', data: inventoryTurnoverData.map((d) => d.date) }]}
                series={[
                  {
                    data: inventoryTurnoverData.map((d) => d.turnover),
                    label: 'Luân chuyển (tấn)',
                    color: '#1976d2',
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
              />
            ) : (
              <Box sx={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</Box>
            )}
          </MainCard>
        </Grid>
      </Grid>

      <ReceiptIssueReportFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default ReceiptIssueReportPage;
