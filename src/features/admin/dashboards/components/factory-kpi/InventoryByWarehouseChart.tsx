// ==============================|| INVENTORY BY WAREHOUSE CHART ||============================== //

import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import type { InventoryByWarehouse } from '../../types';

interface InventoryByWarehouseChartProps {
  data: InventoryByWarehouse[];
}

const InventoryByWarehouseChart = ({ data }: InventoryByWarehouseChartProps) => {
  const chartData = useMemo(() => {
    return {
      xAxis: [
        {
          scaleType: 'band' as const,
          data: data.map((item) => item.warehouse)
        }
      ],
      series: [
        {
          data: data.map((item) => item.quantity),
          label: 'Tồn kho (tấn)',
          color: '#2e7d32'
        }
      ]
    };
  }, [data]);

  return (
    <BarChart
      xAxis={chartData.xAxis}
      series={chartData.series}
      height={350}
      margin={{ left: 60, right: 30, top: 30, bottom: 80 }}
      slotProps={{
        legend: {
          position: { vertical: 'top', horizontal: 'center' }
        }
      }}
    />
  );
};

export default InventoryByWarehouseChart;
