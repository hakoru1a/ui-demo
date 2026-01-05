// ==============================|| PRODUCTION VOLUME CHART ||============================== //

import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';

import type { ProductionVolumeByTime } from '../../types';

interface ProductionVolumeChartProps {
  data: ProductionVolumeByTime[];
}

const ProductionVolumeChart = ({ data }: ProductionVolumeChartProps) => {
  const chartData = useMemo(() => {
    return {
      xAxis: [
        {
          data: data.map((item) => item.time),
          scaleType: 'band' as const
        }
      ],
      series: [
        {
          data: data.map((item) => item.volume),
          label: 'Sản lượng (tấn)',
          color: '#1976d2',
          area: true,
          showMark: true
        }
      ]
    };
  }, [data]);

  return (
    <LineChart
      xAxis={chartData.xAxis}
      series={chartData.series}
      height={350}
      margin={{ left: 60, right: 30, top: 30, bottom: 50 }}
      slotProps={{
        legend: {
          position: { vertical: 'top', horizontal: 'center' }
        }
      }}
    />
  );
};

export default ProductionVolumeChart;
