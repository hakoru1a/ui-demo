// ==============================|| PAB APPROVAL RATIO CHART ||============================== //

import { Box, styled, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo } from 'react';

import type { PabApprovalRatioData } from '../../types/report';

interface PabApprovalRatioChartProps {
  data: PabApprovalRatioData[];
}

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  pointerEvents: 'none',
  color: theme.palette.text.primary
}));

function PieCenterLabel({ totalCount }: { totalCount: number }) {
  return (
    <StyledBox>
      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '24px', lineHeight: 1.2 }}>
        {totalCount}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '14px', opacity: 0.7 }}>
        Tổng số
      </Typography>
    </StyledBox>
  );
}

const PabApprovalRatioChart = ({ data }: PabApprovalRatioChartProps) => {
  const totalCount = useMemo(() => {
    return data.reduce((sum, item) => sum + item.count, 0);
  }, [data]);

  const chartData = useMemo(() => {
    return data.map((item) => ({
      id: item.result,
      value: item.percentage,
      label: `${item.label} (${item.percentage}%)`,
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
        <PieCenterLabel totalCount={totalCount} />
      </PieChart>
    </Box>
  );
};

export default PabApprovalRatioChart;
