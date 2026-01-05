// ==============================|| PRODUCTION REPORT PAGE ||============================== //

import { FilterOutlined } from '@ant-design/icons';
import { Box, Button, Chip, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import ProductionReportFilterDrawer from './ProductionReportFilterDrawer';
import { mockProductionByShift, mockProductionPlanVsActual, mockProductionReportItems } from '../../mock/data';
import type { DashboardFilter } from '../../types';

const ProductionReportPage = () => {
  const filterDrawer = useBoolean(false);
  const [filter, setFilter] = useState<DashboardFilter>({
    startDate: null,
    endDate: null,
    planId: null,
    shiftId: null,
    productId: null
  });

  const reportItems = useMemo(() => mockProductionReportItems, []);
  const planVsActualData = useMemo(() => mockProductionPlanVsActual, []);
  const productionByShiftData = useMemo(() => mockProductionByShift, []);

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<FilterOutlined />} onClick={filterDrawer.onTrue}>
          Chọn bộ lọc
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Production Report Table */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Báo cáo sản xuất" contentSX={{ p: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Lệnh sản xuất</TableCell>
                  <TableCell>Ca</TableCell>
                  <TableCell align="right">Sản lượng kế hoạch</TableCell>
                  <TableCell align="right">Sản lượng thực tế</TableCell>
                  <TableCell align="right">Chênh lệch</TableCell>
                  <TableCell align="right">Tỷ lệ đạt (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportItems.map((item) => (
                  <TableRow key={`${item.date}-${item.productionOrder}-${item.shift}`}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.productionOrder}</TableCell>
                    <TableCell>{item.shift}</TableCell>
                    <TableCell align="right">{item.plannedVolume.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">{item.actualVolume.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">
                      <Typography color={item.difference >= 0 ? 'success.main' : 'error.main'}>
                        {item.difference >= 0 ? '+' : ''}
                        {item.difference.toLocaleString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${item.achievementRate.toFixed(1)}%`}
                        size="small"
                        color={item.achievementRate >= 100 ? 'success' : item.achievementRate >= 90 ? 'warning' : 'error'}
                        variant="light"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </MainCard>
        </Grid>

        {/* Charts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Kế hoạch vs Thực tế" contentSX={{ p: 2 }}>
            {planVsActualData.length > 0 ? (
              <LineChart
                xAxis={[{ scaleType: 'band', data: planVsActualData.map((d) => d.date) }]}
                series={[
                  {
                    data: planVsActualData.map((d) => d.planned),
                    label: 'Kế hoạch',
                    color: '#1976d2',
                    showMark: true
                  },
                  {
                    data: planVsActualData.map((d) => d.actual),
                    label: 'Thực tế',
                    color: '#dc004e',
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
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Sản lượng theo ca" contentSX={{ p: 2 }}>
            {productionByShiftData.length > 0 ? (
              <BarChart
                xAxis={[{ scaleType: 'band', data: productionByShiftData.map((d) => d.shift) }]}
                series={[
                  {
                    data: productionByShiftData.map((d) => d.volume),
                    label: 'Sản lượng (tấn)',
                    color: '#2e7d32'
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

      <ProductionReportFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default ProductionReportPage;
