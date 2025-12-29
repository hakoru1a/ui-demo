// ==============================|| YIELD ESTIMATION REPORT TOOLBAR ||============================== //

import { ArrowLeftOutlined, FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import { Box, Button, Stack } from '@mui/material';

interface ReportToolbarProps {
  onOpenFilter: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onBack: () => void;
}

const ReportToolbar = ({ onOpenFilter, onExportExcel, onExportPDF, onBack }: ReportToolbarProps) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
      <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={onBack}>
        Quay lại
      </Button>
      <Box sx={{ flexGrow: 1 }} />
      <Button variant="outlined" color="success" startIcon={<FileExcelOutlined />} onClick={onExportExcel}>
        Export Excel
      </Button>
      <Button variant="outlined" color="error" startIcon={<FilePdfOutlined />} onClick={onExportPDF}>
        Export PDF
      </Button>
      <Button variant="contained" color="primary" startIcon={<FilterOutlined />} onClick={onOpenFilter}>
        Lọc báo cáo
      </Button>
    </Stack>
  );
};

export default ReportToolbar;
