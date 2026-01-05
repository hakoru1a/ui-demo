// ==============================|| REPORTS PAGE ||============================== //

import { BarChartOutlined } from '@ant-design/icons';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

const reportItems = [
  {
    id: 'pl-report',
    title: 'Báo cáo P&L (Lỗ lãi)',
    description: 'Doanh thu, giá vốn, lợi nhuận gộp, chi phí vận hành, lợi nhuận ròng',
    path: '/reports/pl-report',
    icon: BarChartOutlined
  },
  {
    id: 'production-report',
    title: 'Báo cáo sản xuất',
    description: 'Kế hoạch vs thực tế, sản lượng theo ca, tỷ lệ đạt',
    path: '/reports/production-report',
    icon: BarChartOutlined
  },
  {
    id: 'inventory-report',
    title: 'Báo cáo tồn kho / kiểm kê',
    description: 'Tồn hệ thống, tồn thực tế, chênh lệch, giá trị tồn',
    path: '/reports/inventory-report',
    icon: BarChartOutlined
  },
  {
    id: 'receipt-issue-report',
    title: 'Báo cáo nhập / xuất hàng',
    description: 'Nhập vs xuất, xu hướng luân chuyển, đối tác',
    path: '/reports/receipt-issue-report',
    icon: BarChartOutlined
  },
  {
    id: 'forest-yield-report',
    title: 'Báo cáo sản lượng / vùng trồng',
    description: 'Map vùng trồng, sản lượng theo vùng, tỷ lệ FSC',
    path: '/reports/forest-yield-report',
    icon: BarChartOutlined
  }
];

const ReportsPage = () => {
  const navigate = useNavigate();

  return (
    <MainCard title="Báo cáo">
      <Grid container spacing={3}>
        {reportItems.map((item) => {
          const Icon = item.icon;
          return (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Icon style={{ fontSize: 32, color: '#1976d2' }} />
                      <Typography variant="h6" fontWeight="bold">
                        {item.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </MainCard>
  );
};

export default ReportsPage;
