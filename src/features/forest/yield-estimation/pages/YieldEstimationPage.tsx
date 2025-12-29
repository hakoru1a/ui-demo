// ==============================|| YIELD ESTIMATION PAGE ||============================== //

import { Grid } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import { SUPPLIER_URLS } from 'features/forest/suppliers/types/constants';
import useBoolean from 'hooks/useBoolean';

import ReportFilterDrawer from '../components/ReportFilterDrawer';
import ReportToolbar from '../components/ReportToolbar';
import SupplyShareChart from '../components/SupplyShareChart';
import YieldBySupplierChart from '../components/YieldBySupplierChart';
import YieldOverTimeChart from '../components/YieldOverTimeChart';
import { mockYieldOverTime, mockYieldBySupplier, mockSupplyShare } from '../mock/yieldReports';
import type { YieldReportFilter } from '../types/report';

// Mock supplier options - TODO: Replace with API call
const getMockSupplierOptions = () => [
  { value: '1', label: 'Công ty Lâm sản ABC' },
  { value: '2', label: 'Nguyễn Văn B' },
  { value: '3', label: 'HTX Lâm nghiệp XYZ' },
  { value: '4', label: 'Công ty Gỗ Việt' },
  { value: '5', label: 'Hợp tác xã Đông Nam' }
];

const YieldEstimationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get('supplierId'); // Get supplier ID from query params
  const filterDrawer = useBoolean(false);

  const [filter, setFilter] = useState<YieldReportFilter>({
    startDate: null,
    endDate: null,
    supplierIds: supplierId ? [supplierId] : [] // Default to current supplier if ID provided
  });

  const handleBack = useCallback(() => {
    if (supplierId) {
      navigate(SUPPLIER_URLS.DETAIL(supplierId));
    } else {
      navigate(-1);
    }
  }, [navigate, supplierId]);

  const handleExportExcel = useCallback(() => {
    // TODO: Implement Excel export
    alert('Chức năng Export Excel đang được phát triển');
  }, []);

  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export
    alert('Chức năng Export PDF đang được phát triển');
  }, []);

  const handleFilterApply = useCallback((newFilter: YieldReportFilter) => {
    setFilter(newFilter);
    // TODO: Fetch new data based on filter
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
        {/* Row 1: Yield Over Time (Line Chart) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <MainCard title="Sản lượng theo thời gian" contentSX={{ p: 2 }}>
            <YieldOverTimeChart data={mockYieldOverTime} />
          </MainCard>
        </Grid>

        {/* Row 1: Supply Share (Pie Chart) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard title="Tỷ trọng cung cấp" contentSX={{ p: 2 }}>
            <SupplyShareChart data={mockSupplyShare} />
          </MainCard>
        </Grid>

        {/* Row 2: Yield By Supplier (Bar Chart) */}
        <Grid size={{ xs: 12 }}>
          <MainCard title="Sản lượng theo NCC" contentSX={{ p: 2 }}>
            <YieldBySupplierChart data={mockYieldBySupplier} />
          </MainCard>
        </Grid>
      </Grid>

      <ReportFilterDrawer
        open={filterDrawer.value}
        onClose={filterDrawer.onFalse}
        onApply={handleFilterApply}
        initialFilter={filter}
        supplierOptions={getMockSupplierOptions()}
      />
    </>
  );
};

export default YieldEstimationPage;
