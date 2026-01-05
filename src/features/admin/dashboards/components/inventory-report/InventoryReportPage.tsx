// ==============================|| INVENTORY REPORT PAGE ||============================== //

import { FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import { Box, Button, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import InventoryReportFilterDrawer from './InventoryReportFilterDrawer';
import { mockInventoryReportItems } from '../../mock/data';
import type { DashboardFilter } from '../../types/index';

const InventoryReportPage = () => {
  const filterDrawer = useBoolean(false);
  const [filter, setFilter] = useState<DashboardFilter>({
    startDate: null,
    endDate: null,
    warehouseId: null,
    skuId: null
  });

  const reportItems = useMemo(() => mockInventoryReportItems, []);

  const handleExportExcel = useCallback(() => {
    const headers = ['SKU', 'Tồn hệ thống', 'Tồn thực tế', 'Chênh lệch', 'Giá trị tồn'];
    const rows = reportItems.map((item) => [
      item.sku,
      item.systemStock.toString(),
      item.actualStock.toString(),
      item.difference.toString(),
      item.stockValue.toLocaleString('vi-VN')
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-ton-kho-${new Date().toISOString().split('T')[0]}.csv`);
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
        <Grid size={{ xs: 12 }}>
          <MainCard title="Báo cáo tồn kho / kiểm kê" contentSX={{ p: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Tồn hệ thống</TableCell>
                  <TableCell align="right">Tồn thực tế</TableCell>
                  <TableCell align="right">Chênh lệch</TableCell>
                  <TableCell align="right">Giá trị tồn (VNĐ)</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportItems.map((item) => (
                  <TableRow key={item.sku}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell align="right">{item.systemStock.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">{item.actualStock.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">
                      <Typography
                        color={item.difference === 0 ? 'text.primary' : item.difference > 0 ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {item.difference >= 0 ? '+' : ''}
                        {item.difference.toLocaleString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{item.stockValue.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" onClick={() => alert('Xem phiếu kiểm kê')}>
                        Xem phiếu
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </MainCard>
        </Grid>
      </Grid>

      <InventoryReportFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default InventoryReportPage;
