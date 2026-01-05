// ==============================|| TRANSFER TRACEABILITY PAGE ||============================== //

import { ArrowLeftOutlined, FilePdfOutlined, GlobalOutlined } from '@ant-design/icons';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

// project imports
import CircularLoader from 'components/CircularLoader';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import dateHelper from 'utils/dateHelper';

import { getMockTransferTraceability, getMockTransferTraceabilityByCode } from '../mock/traceability';
import { CERTIFICATION_OPTIONS, getLabelFromOptions, TRANSFER_URLS, TRACE_STATUS_OPTIONS } from '../types/constants';
import type { TransferTraceability, WarehouseHistoryEntry } from '../types/traceability';

// ==============================|| TRANSFER TRACEABILITY PAGE ||============================== //

const TransferTraceabilityPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const transferCodeParam = searchParams.get('code');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TransferTraceability | null>(null);
  const [searchCode, setSearchCode] = useState(transferCodeParam || '');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        let traceability: TransferTraceability | null = null;

        // If transfer code is provided in search params, search by code
        if (transferCodeParam) {
          traceability = getMockTransferTraceabilityByCode(transferCodeParam);
        } else if (id && id !== 'traceability') {
          // Otherwise, get by transfer ID (check if id is not 'traceability' which is the route path)
          traceability = getMockTransferTraceability(id);
        }

        if (traceability) {
          setData(traceability);
          setSearchCode(traceability.transferCode);
        } else if (id || transferCodeParam) {
          setError('Không tìm thấy thông tin truy xuất nguồn gốc');
        }
      } catch {
        setError('Có lỗi xảy ra khi tải thông tin truy xuất');
      }

      setIsLoading(false);
    };

    if (id || transferCodeParam) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [id, transferCodeParam]);

  // Handle search by transfer code
  const handleSearch = useCallback(() => {
    if (searchCode) {
      navigate(`${TRANSFER_URLS.TRACEABILITY_SEARCH}?code=${searchCode}`);
    }
  }, [navigate, searchCode]);

  // Handle view map
  const handleViewMap = useCallback(() => {
    if (data?.originAreaId) {
      // TODO: Navigate to map view
      console.warn('View map for origin area:', data.originAreaId);
      alert('Xem bản đồ vùng trồng (Mock)');
    }
  }, [data]);

  // Handle export PDF
  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export
    console.warn('Export PDF for traceability:', data?.id);
    alert('Export PDF báo cáo truy xuất (Mock)');
  }, [data]);

  // Handle back
  const handleBack = useCallback(() => {
    if (id && id !== 'traceability') {
      navigate(TRANSFER_URLS.DETAIL(id));
    } else {
      navigate(TRANSFER_URLS.LIST);
    }
  }, [navigate, id]);

  // Get certification color
  const getCertificationColor = (cert: string) => {
    if (cert === 'FSC') return 'success';
    if (cert === 'PEFC') return 'info';
    return 'default';
  };

  // Get trace status color
  const getTraceStatusColor = (status: string) => {
    if (status === 'full') return 'success';
    if (status === 'missing') return 'error';
    return 'default';
  };

  // Loading state
  if (isLoading) {
    return (
      <MainCard title="Truy xuất nguồn gốc">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularLoader />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (error) {
    return (
      <MainCard
        title="Truy xuất nguồn gốc"
        secondary={
          <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        }
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Tìm kiếm theo mã phiếu chuyển kho"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              size="medium"
              sx={{ minWidth: 300 }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Stack>
        </Box>
      </MainCard>
    );
  }

  if (!data) {
    return (
      <MainCard
        title="Truy xuất nguồn gốc"
        secondary={
          <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
        }
      >
        <Alert severity="info" sx={{ mb: 2 }}>
          Không tìm thấy thông tin truy xuất
        </Alert>
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Tìm kiếm theo mã phiếu chuyển kho"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              size="medium"
              sx={{ minWidth: 300 }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Stack>
        </Box>
      </MainCard>
    );
  }

  const hasOriginArea = !!data.originAreaId;

  return (
    <MainCard
      title="Truy xuất nguồn gốc"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại
          </Button>
          <Button variant="outlined" color="info" startIcon={<FilePdfOutlined />} onClick={handleExportPDF}>
            Export PDF
          </Button>
          {hasOriginArea && (
            <Button variant="outlined" color="primary" startIcon={<GlobalOutlined />} onClick={handleViewMap}>
              Xem bản đồ vùng trồng
            </Button>
          )}
        </Stack>
      }
    >
      <Grid container spacing={3}>
        {/* Search Section */}
        <Grid size={12}>
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Tìm kiếm theo mã phiếu chuyển kho"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                size="medium"
                sx={{ minWidth: 300 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button variant="contained" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </Stack>
          </Box>
        </Grid>

        {/* Basic Information */}
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin cơ bản
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Mã phiếu chuyển kho"
            value={data.transferCode}
            fullWidth
            disabled
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="SKU - Hàng hóa"
            value={`${data.skuCode} - ${data.skuName}`}
            fullWidth
            disabled
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Batch / Lot - Lô"
            value={data.batchCode}
            fullWidth
            disabled
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
        </Grid>

        {/* Origin Information */}
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
            Thông tin nguồn gốc
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Origin Area - Vùng trồng"
            value={data.originAreaName || '-'}
            fullWidth
            disabled
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Harvest Plan - Kế hoạch khai thác"
            value={data.harvestPlanCode || '-'}
            fullWidth
            disabled
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Supplier - Nhà cung cấp"
            value={data.supplierName || '-'}
            fullWidth
            disabled
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Production Batch - Lô sản xuất"
            value={data.productionBatchCode || '-'}
            fullWidth
            disabled
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
        </Grid>

        {/* Certification and Status */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Certification - Chứng chỉ
          </Typography>
          <Chip
            label={getLabelFromOptions(data.certification, CERTIFICATION_OPTIONS)}
            color={getCertificationColor(data.certification)}
            size="medium"
            variant="light"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Trace Status - Trạng thái truy xuất
          </Typography>
          <Chip
            label={getLabelFromOptions(data.traceStatus, TRACE_STATUS_OPTIONS)}
            color={getTraceStatusColor(data.traceStatus)}
            size="medium"
            variant="light"
          />
        </Grid>

        {/* Warehouse History */}
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
            Warehouse History - Lịch sử kho
          </Typography>
        </Grid>

        <Grid size={12}>
          {data.warehouseHistory.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Không có lịch sử kho
              </Typography>
            </Box>
          ) : (
            <ScrollX>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Ngày giờ</TableCell>
                      <TableCell>Kho</TableCell>
                      <TableCell>Hành động</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell>Đơn vị</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.warehouseHistory.map((entry: WarehouseHistoryEntry, index: number) => {
                      const entryKey = `${entry.date}-${entry.warehouseName}-${entry.action}-${index}`;
                      return (
                        <TableRow key={entryKey} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body2">{dateHelper.formatDate(entry.date, 'DD/MM/YYYY HH:mm')}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{entry.warehouseName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{entry.action}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{entry.quantity.toLocaleString('vi-VN')}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{entry.unit}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </ScrollX>
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default TransferTraceabilityPage;
