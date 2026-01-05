// ==============================|| FACTORY KPI DASHBOARD PAGE ||============================== //

import { FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import { Box, Button, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import CostByBusinessChart from './CostByBusinessChart';
import FactoryKPIFilterDrawer from './FactoryKPIFilterDrawer';
import InventoryByWarehouseChart from './InventoryByWarehouseChart';
import KPICard from './KPICard';
import ProductionVolumeChart from './ProductionVolumeChart';
import { mockCostByBusiness, mockFactoryKPIData, mockInventoryByWarehouse, mockProductionVolumeByTime } from '../../mock/data';
import type { DashboardFilter } from '../../types';

const FactoryKPIPage = () => {
  const filterDrawer = useBoolean(false);
  const [filter, setFilter] = useState<DashboardFilter>({
    startDate: null,
    endDate: null,
    factoryId: null,
    productId: null,
    forestAreaId: null,
    period: 'month'
  });

  // In a real app, these would be fetched based on filter
  const kpiData = useMemo(() => mockFactoryKPIData, []);
  const productionVolumeData = useMemo(() => mockProductionVolumeByTime, []);
  const costByBusinessData = useMemo(() => mockCostByBusiness, []);
  const inventoryByWarehouseData = useMemo(() => mockInventoryByWarehouse, []);

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
        {/* KPI Cards Row */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <KPICard title="Sản lượng sản xuất" value={kpiData.productionVolume} unit="tấn" change={kpiData.productionVolumeChange} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <MainCard title="Tỷ lệ đạt kế hoạch" contentSX={{ p: 2 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight="bold">
                  {kpiData.planAchievementRate.toFixed(1)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={kpiData.planAchievementRate}
                sx={{ height: 10, borderRadius: 5 }}
                color={kpiData.planAchievementRate >= 90 ? 'success' : kpiData.planAchievementRate >= 80 ? 'warning' : 'error'}
              />
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <KPICard title="Chi phí / tấn" value={kpiData.costPerTon.toLocaleString('vi-VN')} unit="VNĐ" />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <KPICard title="Tồn kho hiện tại" value={kpiData.currentInventory} unit="SKU" />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <KPICard title="Tỷ lệ QC đạt" value={kpiData.qcPassRate.toFixed(1)} unit="%" />
        </Grid>

        {/* Charts Row */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Sản lượng theo thời gian" contentSX={{ p: 2 }}>
            {productionVolumeData.length > 0 ? (
              <ProductionVolumeChart data={productionVolumeData} />
            ) : (
              <Box sx={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</Box>
            )}
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Chi phí theo nghiệp vụ" contentSX={{ p: 2 }}>
            {costByBusinessData.length > 0 ? (
              <CostByBusinessChart data={costByBusinessData} />
            ) : (
              <Box sx={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</Box>
            )}
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Tồn kho theo kho" contentSX={{ p: 2 }}>
            {inventoryByWarehouseData.length > 0 ? (
              <InventoryByWarehouseChart data={inventoryByWarehouseData} />
            ) : (
              <Box sx={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</Box>
            )}
          </MainCard>
        </Grid>
      </Grid>

      <FactoryKPIFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default FactoryKPIPage;
