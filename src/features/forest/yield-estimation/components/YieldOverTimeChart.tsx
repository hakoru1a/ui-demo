// ==============================|| YIELD OVER TIME CHART ||============================== //

import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';

import { YieldOverTimeData } from '../types/report';

interface YieldOverTimeChartProps {
  data: YieldOverTimeData[];
}

const YieldOverTimeChart = ({ data }: YieldOverTimeChartProps) => {
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
          data: data.map((item) => item.totalYield),
          label: 'Tổng m³',
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
    />
  );
};

export default YieldOverTimeChart;
