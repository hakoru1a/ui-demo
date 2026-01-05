// ==============================|| COST BY BUSINESS CHART ||============================== //

import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import type { CostByBusiness } from '../../types';

interface CostByBusinessChartProps {
  data: CostByBusiness[];
}

const CostByBusinessChart = ({ data }: CostByBusinessChartProps) => {
  const chartData = useMemo(() => {
    return {
      xAxis: [
        {
          scaleType: 'band' as const,
          data: data.map((item) => item.category)
        }
      ],
      series: [
        {
          data: data.map((item) => item.production),
          label: 'Sản xuất',
          color: '#1976d2'
        },
        {
          data: data.map((item) => item.logistics),
          label: 'Logistics',
          color: '#dc004e'
        },
        {
          data: data.map((item) => item.other),
          label: 'Khác',
          color: '#ed6c02'
        }
      ]
    };
  }, [data]);

  return (
    <BarChart
      xAxis={chartData.xAxis}
      series={chartData.series}
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
  );
};

export default CostByBusinessChart;
