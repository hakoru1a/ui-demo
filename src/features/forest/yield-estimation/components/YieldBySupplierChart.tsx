// ==============================|| YIELD BY SUPPLIER CHART ||============================== //

import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';

import { YieldBySupplierData } from '../types/report';

interface YieldBySupplierChartProps {
  data: YieldBySupplierData[];
}

const YieldBySupplierChart = ({ data }: YieldBySupplierChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    return {
      xAxis: [
        {
          scaleType: 'band' as const,
          data: data.map((item) => item.supplierName)
        }
      ],
      series: [
        {
          data: data.map((item) => item.totalYield),
          label: 'Tổng m³',
          color: theme.palette.primary.main
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
    />
  );
};

export default YieldBySupplierChart;
