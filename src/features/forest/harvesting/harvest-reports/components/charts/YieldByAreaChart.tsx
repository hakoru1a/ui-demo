import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { YieldByAreaData } from '../../types/index';

interface YieldByAreaChartProps {
  data: YieldByAreaData[];
}

const YieldByAreaChart = ({ data }: YieldByAreaChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    return {
      xAxis: [
        {
          scaleType: 'band' as const,
          data: data.map((item) => item.areaName)
        }
      ],
      series: [
        {
          data: data.map((item) => item.totalYield),
          label: 'Sản lượng (m³)',
          color: theme.palette.success.main
        }
      ]
    };
  }, [data, theme]);

  return (
    <BarChart
      xAxis={chartData.xAxis}
      series={chartData.series}
      height={350}
      margin={{ left: 50, right: 30, top: 30, bottom: 30 }}
      slotProps={{
        legend: {}
      }}
    />
  );
};

export default YieldByAreaChart;
