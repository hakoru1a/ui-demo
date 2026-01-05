// ==============================|| FOREST YIELD REPORT PAGE ||============================== //

import { FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import { Box, Button, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import ForestYieldReportFilterDrawer from './ForestYieldReportFilterDrawer';
import { mockForestAreaYield } from '../../mock/data';
import type { DashboardFilter } from '../../types';

const ForestYieldReportPage = () => {
  const filterDrawer = useBoolean(false);
  const [filter, setFilter] = useState<DashboardFilter>({
    startDate: null,
    endDate: null,
    forestAreaId: null,
    certificateType: null
  });

  const yieldData = useMemo(() => mockForestAreaYield, []);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" startIcon={<FilePdfOutlined />} onClick={handleExportPDF}>
          Export PDF
        </Button>
        <Button variant="contained" startIcon={<FilterOutlined />} onClick={filterDrawer.onTrue}>
          Chọn bộ lọc
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Map placeholder */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Map vùng trồng" contentSX={{ p: 2, minHeight: 400 }}>
            <Box
              sx={{
                width: '100%',
                height: 400,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                border: '2px dashed #ccc'
              }}
            >
              <Typography variant="body1" color="textSecondary">
                [Heatmap theo sản lượng - Map component sẽ được tích hợp sau]
              </Typography>
            </Box>
          </MainCard>
        </Grid>

        {/* Yield Table */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Bảng sản lượng" contentSX={{ p: 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vùng trồng</TableCell>
                  <TableCell align="right">Diện tích (ha)</TableCell>
                  <TableCell align="right">Sản lượng khai thác (m³)</TableCell>
                  <TableCell align="right">Tỷ lệ đạt FSC (%)</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yieldData.map((item) => (
                  <TableRow key={item.forestArea}>
                    <TableCell>{item.forestArea}</TableCell>
                    <TableCell align="right">{item.area.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">{item.yield.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">{item.fscRate.toFixed(1)}%</TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" onClick={() => alert('Xem chi tiết vùng')}>
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </MainCard>
        </Grid>
      </Grid>

      <ForestYieldReportFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default ForestYieldReportPage;
