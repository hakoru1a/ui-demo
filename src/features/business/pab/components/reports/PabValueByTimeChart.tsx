// ==============================|| PAB VALUE BY TIME CHART ||============================== //

import { LineChart } from '@mui/x-charts/LineChart';

import type { PabValueByTimeData } from '../../types/report';
import { formatCurrency } from '../../utils';

interface PabValueByTimeChartProps {
  data: PabValueByTimeData[];
}

const PabValueByTimeChart = ({ data }: PabValueByTimeChartProps) => {
  return (
    <LineChart
      xAxis={[{ scaleType: 'point', data: data.map((d) => d.month) }]}
      series={[
        {
          data: data.map((d) => d.totalValue),
          label: 'Tổng giá trị',
          color: '#1976d2'
        }
      ]}
      height={350}
      yAxis={[
        {
          valueFormatter: (value: number) => formatCurrency(value)
        }
      ]}
    />
  );
};

export default PabValueByTimeChart;
