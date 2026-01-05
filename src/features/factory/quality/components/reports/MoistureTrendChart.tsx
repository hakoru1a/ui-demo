// ==============================|| MOISTURE TREND CHART ||============================== //

import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';

import type { MoistureTrendData } from '../../types/report';

interface MoistureTrendChartProps {
  data: MoistureTrendData[];
}

const MoistureTrendChart = ({ data }: MoistureTrendChartProps) => {
  const chartData = useMemo(() => {
    return {
      xAxis: [
        {
          data: data.map((item) => new Date(item.date)),
          scaleType: 'time' as const,
          valueFormatter: (date: Date) => date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
        }
      ],
      series: [
        {
          data: data.map((item) => item.moisture),
          label: '% Độ ẩm',
          color: '#36A2EB',
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
      yAxis={[
        {
          valueFormatter: (value: number | null) => (value !== null ? `${value.toFixed(2)}%` : '')
        }
      ]}
    />
  );
};

export default MoistureTrendChart;
