// ==============================|| QUALITY REPORTS PAGE ||============================== //

import { Grid } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import useBoolean from 'hooks/useBoolean';

import ImpurityByBatchChart from '../components/reports/ImpurityByBatchChart';
import MoistureTrendChart from '../components/reports/MoistureTrendChart';
import QCResultDistributionChart from '../components/reports/QCResultDistributionChart';
import ReportFilterDrawer from '../components/reports/ReportFilterDrawer';
import ReportToolbar from '../components/reports/ReportToolbar';
import { getMockQualityInspections } from '../mock/qualityInspections';
import type { QualityReportFilter } from '../types/report';
import {
  filterQualityInspections,
  processImpurityByBatchData,
  processMoistureTrendData,
  processQCResultDistributionData
} from '../utils/reportDataProcessor';

const QualityReportsPage = () => {
  const filterDrawer = useBoolean(false);
  const [filter, setFilter] = useState<QualityReportFilter>({
    startDate: null,
    endDate: null,
    productIds: [],
    batchIds: []
  });

  // Get all mock inspections
  const allInspections = useMemo(() => getMockQualityInspections(), []);

  // Filter inspections based on current filter
  const filteredInspections = useMemo(() => {
    return filterQualityInspections(allInspections, filter);
  }, [allInspections, filter]);

  // Process data for charts
  const moistureTrendData = useMemo(() => {
    return processMoistureTrendData(filteredInspections);
  }, [filteredInspections]);

  const impurityByBatchData = useMemo(() => {
    return processImpurityByBatchData(filteredInspections);
  }, [filteredInspections]);

  const qcResultDistributionData = useMemo(() => {
    return processQCResultDistributionData(filteredInspections);
  }, [filteredInspections]);

  const handleExportExcel = useCallback(() => {
    // TODO: Implement Excel export
    // For now, we'll create a simple CSV-like export
    const headers = ['Ngày kiểm tra', 'Sản phẩm', 'Lô', 'Độ ẩm (%)', 'Tạp chất (%)', 'Kết quả'];
    const rows = filteredInspections.map((inspection) => [
      typeof inspection.inspectionDate === 'string'
        ? inspection.inspectionDate
        : new Date(inspection.inspectionDate).toLocaleDateString('vi-VN'),
      inspection.productName,
      inspection.batchCode,
      inspection.moisture.toFixed(2),
      inspection.impurity.toFixed(2),
      inspection.result === 'passed' ? 'Đạt' : 'Không đạt'
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-kiem-tra-do-am-tap-chat-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredInspections]);

  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export using a library like jsPDF or react-pdf
    // For now, we'll use window.print() as a simple solution
    window.print();
  }, []);

  return (
    <>
      <ReportToolbar onOpenFilter={filterDrawer.onTrue} onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />

      <Grid container spacing={3}>
        {/* Row 1: Moisture Trend (Line Chart) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <MainCard title="Xu hướng độ ẩm theo thời gian" contentSX={{ p: 2 }}>
            {moistureTrendData.length > 0 ? (
              <MoistureTrendChart data={moistureTrendData} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</div>
            )}
          </MainCard>
        </Grid>

        {/* Row 1: QC Result Distribution (Pie Chart) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard title="Phân bố kết quả QC" contentSX={{ p: 2 }}>
            {qcResultDistributionData.some((item) => item.count > 0) ? (
              <QCResultDistributionChart data={qcResultDistributionData} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</div>
            )}
          </MainCard>
        </Grid>

        {/* Row 2: Impurity By Batch (Bar Chart) */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Tỷ lệ tạp chất theo lô" contentSX={{ p: 2 }}>
            {impurityByBatchData.length > 0 ? (
              <ImpurityByBatchChart data={impurityByBatchData} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Không có dữ liệu để hiển thị</div>
            )}
          </MainCard>
        </Grid>
      </Grid>

      <ReportFilterDrawer open={filterDrawer.value} onClose={filterDrawer.onFalse} onApply={setFilter} initialFilter={filter} />
    </>
  );
};

export default QualityReportsPage;
