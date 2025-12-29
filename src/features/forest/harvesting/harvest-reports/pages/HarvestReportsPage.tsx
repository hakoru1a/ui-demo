import { Grid } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import CompletionRateChart from '../components/charts/CompletionRateChart';
import YieldByAreaChart from '../components/charts/YieldByAreaChart';
import YieldOverTimeChart from '../components/charts/YieldOverTimeChart';
import ReportFilterDrawer from '../components/ReportFilterDrawer';
import ReportToolbar from '../components/ReportToolbar';
import { mockCompletionRate, mockYieldByArea, mockYieldOverTime } from '../mock/harvestReports';
import { ReportFilter } from '../types/index';

// ==============================|| HARVEST REPORTS PAGE ||============================== //

const HarvestReportsPage = () => {
  const navigate = useNavigate();
  const filterDrawer = useBoolean(false);
  // const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState<ReportFilter>({
    startDate: null,
    endDate: null,
    forestAreaIds: []
  });

  // Mock data loading on filter change
  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 800);
  //   return () => clearTimeout(timer);
  // }, [filter]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleExportExcel = useCallback(() => {
    alert('Export Excel (Mock)');
  }, []);

  const handleExportPDF = useCallback(() => {
    alert('Export PDF (Mock)');
  }, []);

  return (
    <>
      <ReportToolbar
        onOpenFilter={filterDrawer.onTrue}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        onBack={handleBack}
      />

      <Grid container spacing={3}>
        {/* Row 1: Production Over Time (Line Chart) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <MainCard title="Sản lượng khai thác theo thời gian" contentSX={{ p: 2 }}>
            <YieldOverTimeChart data={mockYieldOverTime} />
          </MainCard>
        </Grid>

        {/* Row 1: Completion Rate (Pie Chart) - Placed nicely next to line chart on desktop */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard title="Tỷ lệ hoàn thành kế hoạch" contentSX={{ p: 2 }}>
            <CompletionRateChart data={mockCompletionRate} />
          </MainCard>
        </Grid>

        {/* Row 2: Production By Area (Bar Chart) */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Sản lượng theo khu vực" contentSX={{ p: 2 }}>
            <YieldByAreaChart data={mockYieldByArea} />
          </MainCard>
        </Grid>
      </Grid>

      <ReportFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default HarvestReportsPage;
