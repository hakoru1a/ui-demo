import { styled } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { PieChart } from '@mui/x-charts/PieChart';

import { CompletionRateData } from '../../types/index';

interface CompletionRateChartProps {
  data: CompletionRateData[];
}

// Custom hook for center label
const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

const CompletionRateChart = ({ data }: CompletionRateChartProps) => {
  return (
    <PieChart
      series={[
        {
          data: data.map((item) => ({
            id: item.status,
            value: item.value,
            label: item.label,
            color: item.color
          })),
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
      <PieCenterLabel>Tổng quan</PieCenterLabel>
    </PieChart>
  );
};

export default CompletionRateChart;
