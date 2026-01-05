// ==============================|| IMPURITY BY BATCH CHART ||============================== //

import { useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import type { ImpurityByBatchData } from '../../types/report';

interface ImpurityByBatchChartProps {
  data: ImpurityByBatchData[];
}

const ImpurityByBatchChart = ({ data }: ImpurityByBatchChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    return {
      xAxis: [
        {
          scaleType: 'band' as const,
          data: data.map((item) => item.batchCode)
        }
      ],
      series: [
        {
          data: data.map((item) => item.impurity),
          label: '% Tạp chất',
          color: theme.palette.warning.main
        }
      ]
    };
  }, [data, theme]);

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
      yAxis={[
        {
          valueFormatter: (value: number | null) => (value !== null ? `${value.toFixed(2)}%` : '')
        }
      ]}
    />
  );
};

export default ImpurityByBatchChart;
