// ==============================|| SUPPLY SHARE CHART ||============================== //

import { Box, styled, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo } from 'react';

import { SupplyShareData } from '../types/report';

interface SupplyShareChartProps {
  data: SupplyShareData[];
}

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  pointerEvents: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.text.primary
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  return <StyledBox>{children}</StyledBox>;
}

const SupplyShareChart = ({ data }: SupplyShareChartProps) => {
  const totalYield = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const chartData = useMemo(() => {
    return data.map((item) => ({
      id: item.supplierName,
      value: item.percentage,
      label: `${item.supplierName} (${item.percentage.toFixed(1)}%)`,
      color: item.color
    }));
  }, [data]);

  return (
    <Box sx={{ position: 'relative' }}>
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 80,
            outerRadius: 120,
            paddingAngle: 2,
            cornerRadius: 4,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
          }
        ]}
        height={350}
        slotProps={{
          legend: {
            position: { vertical: 'bottom', horizontal: 'center' }
          }
        }}
      >
        <PieCenterLabel>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {totalYield.toLocaleString('vi-VN')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            m³
          </Typography>
        </PieCenterLabel>
      </PieChart>
    </Box>
  );
};

export default SupplyShareChart;
