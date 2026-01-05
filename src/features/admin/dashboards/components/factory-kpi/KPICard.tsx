// ==============================|| KPI CARD ||============================== //

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, CardContent, Stack, Typography, useTheme } from '@mui/material';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number; // % change from previous period
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

const KPICard = ({ title, value, change, unit, color = 'primary' }: KPICardProps) => {
  const theme = useTheme();
  const isPositive = change !== undefined && change >= 0;
  const changeColor = isPositive ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h3" fontWeight="bold">
              {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
            </Typography>
            {unit && (
              <Typography variant="h6" color="textSecondary">
                {unit}
              </Typography>
            )}
          </Stack>
          {change !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {isPositive ? <ArrowUpOutlined style={{ color: changeColor }} /> : <ArrowDownOutlined style={{ color: changeColor }} />}
              <Typography variant="body2" sx={{ color: changeColor }}>
                {Math.abs(change).toFixed(1)}% so với kỳ trước
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default KPICard;
