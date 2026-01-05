// ==============================|| PAB REPORTS PAGE ||============================== //

import { Grid } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import PabApprovalRatioChart from '../components/reports/PabApprovalRatioChart';
import PabReportFilterDrawer from '../components/reports/PabReportFilterDrawer';
import PabStatusCountChart from '../components/reports/PabStatusCountChart';
import PabValueByTimeChart from '../components/reports/PabValueByTimeChart';
import ReportToolbar from '../components/reports/ReportToolbar';
import { getMockPabs } from '../mock/pabs';
import type { PabReportFilter } from '../types/report';
import {
  filterPabs,
  processPabStatusCountData,
  processPabValueByTimeData,
  processPabApprovalRatioData
} from '../utils/reportDataProcessor';

const PabReportsPage = () => {
  const filterDrawer = useBoolean(false);
  const [filter, setFilter] = useState<PabReportFilter>({
    startDate: null,
    endDate: null
  });

  // Get all mock PABs
  const allPabs = useMemo(() => getMockPabs(), []);

  // Filter PABs based on current filter
  const filteredPabs = useMemo(() => {
    return filterPabs(allPabs, filter);
  }, [allPabs, filter]);

  // Process data for charts
  const statusCountData = useMemo(() => {
    return processPabStatusCountData(filteredPabs);
  }, [filteredPabs]);

  const valueByTimeData = useMemo(() => {
    return processPabValueByTimeData(filteredPabs);
  }, [filteredPabs]);

  const approvalRatioData = useMemo(() => {
    return processPabApprovalRatioData(filteredPabs);
  }, [filteredPabs]);

  const handleExportExcel = useCallback(() => {
    // TODO: Implement Excel export
    const headers = ['Mã PAB', 'Khách hàng', 'Sản phẩm', 'Số lượng', 'Chi phí ước tính', 'Trạng thái'];
    const rows = filteredPabs.map((pab) => [
      pab.code,
      pab.customerName,
      pab.productName,
      `${pab.quantity} ${pab.unit}`,
      pab.estimatedCost.toLocaleString('vi-VN'),
      pab.status
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-pab-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredPabs]);

  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export using a library like jsPDF or react-pdf
    // For now, we'll use window.print() as a simple solution
    window.print();
  }, []);

  return (
    <>
      <ReportToolbar onOpenFilter={filterDrawer.onTrue} onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />

      <Grid container spacing={3}>
        {/* Row 1: Số lượng PAB theo trạng thái (Bar Chart) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Số lượng PAB theo trạng thái" contentSX={{ p: 2 }}>
            {statusCountData.length > 0 ? (
              <PabStatusCountChart data={statusCountData} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</div>
            )}
          </MainCard>
        </Grid>

        {/* Row 1: Tỷ lệ duyệt / từ chối (Pie Chart) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard title="Tỷ lệ duyệt / từ chối" contentSX={{ p: 2 }}>
            {approvalRatioData.some((item) => item.count > 0) ? (
              <PabApprovalRatioChart data={approvalRatioData} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</div>
            )}
          </MainCard>
        </Grid>

        {/* Row 2: Giá trị PAB theo thời gian (Line Chart) */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Giá trị PAB theo thời gian" contentSX={{ p: 2 }}>
            {valueByTimeData.length > 0 ? (
              <PabValueByTimeChart data={valueByTimeData} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</div>
            )}
          </MainCard>
        </Grid>
      </Grid>

      <PabReportFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default PabReportsPage;
