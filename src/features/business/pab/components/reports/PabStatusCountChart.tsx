// ==============================|| PAB STATUS COUNT CHART ||============================== //

import { BarChart } from '@mui/x-charts/BarChart';

import type { PabStatusCountData } from '../../types/report';

interface PabStatusCountChartProps {
  data: PabStatusCountData[];
}

const PabStatusCountChart = ({ data }: PabStatusCountChartProps) => {
  const chartData = data.map((item) => ({
    status: item.label,
    count: item.count
  }));

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: chartData.map((d) => d.status) }]}
      series={[
        {
          data: chartData.map((d) => d.count),
          color: '#1976d2'
        }
      ]}
      height={350}
    />
  );
};

export default PabStatusCountChart;
