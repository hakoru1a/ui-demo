import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';

import { YieldOverTimeData } from '../../types/index';

interface YieldOverTimeChartProps {
  data: YieldOverTimeData[];
}

const YieldOverTimeChart = ({ data }: YieldOverTimeChartProps) => {
  const chartData = useMemo(() => {
    return {
      xAxis: [
        {
          data: data.map((item) => new Date(item.time)),
          scaleType: 'time' as const,
          valueFormatter: (date: Date) => date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
        }
      ],
      series: [
        {
          data: data.map((item) => item.totalYield),
          label: 'Sản lượng thực tế (m³)',
          color: '#36A2EB',
          area: true,
          showMark: true
        },
        {
          data: data.map((item) => item.planYield),
          label: 'Kế hoạch (m³)',
          color: '#FF6384',
          showMark: false,
          dashStyle: [5, 5]
        }
      ]
    };
  }, [data]);

  return (
    <LineChart
      xAxis={chartData.xAxis}
      series={chartData.series}
      height={350}
      margin={{ left: 50, right: 30, top: 30, bottom: 30 }}
      slotProps={{
        legend: {
          position: { vertical: 'top', horizontal: 'center' }
        }
      }}
    />
  );
};

export default YieldOverTimeChart;
