// ==============================|| QUALITY REPORT TOOLBAR ||============================== //

import { FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import { Box, Button, Stack } from '@mui/material';

interface ReportToolbarProps {
  onOpenFilter: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

const ReportToolbar = ({ onOpenFilter, onExportExcel, onExportPDF }: ReportToolbarProps) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
      <Box sx={{ flexGrow: 1 }} />
      <Button variant="outlined" startIcon={<FileExcelOutlined />} onClick={onExportExcel}>
        Export Excel
      </Button>
      <Button variant="outlined" startIcon={<FilePdfOutlined />} onClick={onExportPDF}>
        Export PDF
      </Button>
      <Button variant="contained" startIcon={<FilterOutlined />} onClick={onOpenFilter}>
        Chọn bộ lọc
      </Button>
    </Stack>
  );
};

export default ReportToolbar;
