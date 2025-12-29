import { ArrowLeftOutlined, FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import { Stack, Button, Alert, IconButton, Tooltip } from '@mui/material';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { useTableFilters, useTableSelection, useTableColumns, useTable, useTableCSV } from 'hooks/table';
import useBoolean from 'hooks/useBoolean';

import { useSupplierTransactionColumns } from '../components/SupplierTransactionColumns';
import SupplierTransactionFilterPopover from '../components/SupplierTransactionFilterPopover';
import SupplierTransactionTable from '../components/SupplierTransactionTable';
import type { Supplier, SupplierTransaction, SupplierTransactionHistoryFilters } from '../types';
import { SUPPLIER_URLS } from '../types/constants';

// Mock data - TODO: Replace with API call
const getMockSupplier = (id: string): Supplier | null => {
  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      code: 'NCC001',
      name: 'Công ty Lâm sản ABC',
      type: 'business',
      representative: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'contact@abc.com',
      address: '123 Đường XYZ, Quận 1, TP.HCM',
      region: 'Đắk Lắk',
      status: 'active',
      certificates: ['FSC', 'PEFC'],
      averageMonthlyYield: 1500.5,
      notes: 'Nhà cung cấp uy tín'
    }
  ];
  return mockSuppliers.find((s) => s.id === id) || null;
};

const getMockTransactions = (supplierId: string): SupplierTransaction[] => [
  {
    id: '1',
    code: 'GD001',
    supplierId,
    supplierName: 'Công ty Lâm sản ABC',
    transactionDate: new Date('2024-01-15'),
    type: 'import',
    quantity: 500.5,
    estimatedUnitPrice: 1500000,
    estimatedTotal: 750750000,
    status: 'completed'
  },
  {
    id: '2',
    code: 'GD002',
    supplierId,
    supplierName: 'Công ty Lâm sản ABC',
    transactionDate: new Date('2024-01-20'),
    type: 'adjustment',
    quantity: -50.0,
    estimatedUnitPrice: 1500000,
    estimatedTotal: -75000000,
    status: 'completed'
  },
  {
    id: '3',
    code: 'GD003',
    supplierId,
    supplierName: 'Công ty Lâm sản ABC',
    transactionDate: new Date('2024-02-10'),
    type: 'import',
    quantity: 800.0,
    estimatedUnitPrice: 1600000,
    estimatedTotal: 1280000000,
    status: 'cancelled'
  }
];

// ==============================|| SUPPLIER TRANSACTION HISTORY PAGE ||============================== //

const SupplierTransactionHistoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const intl = useIntl();
  const filterPopover = useBoolean(false);
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [transactions, setTransactions] = useState<SupplierTransaction[]>([]);
  const [isLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState<SupplierTransactionHistoryFilters>({
    supplierId: id,
    startDate: undefined,
    endDate: undefined,
    type: undefined,
    status: undefined
  });

  // Delete dialog state
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; transaction: SupplierTransaction | null }>({
    open: false,
    transaction: null
  });

  // Fetch supplier and transactions on mount
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundSupplier = getMockSupplier(id);
        if (foundSupplier) {
          setSupplier(foundSupplier);
          setFilters((prev) => ({ ...prev, supplierId: id }));
        }

        const foundTransactions = getMockTransactions(id);
        setTransactions(foundTransactions);
      }
    };

    fetchData();
  }, [id]);

  // Filter transactions based on filters
  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (filters.startDate && filters.endDate) {
      result = result.filter((t) => {
        const txDate = new Date(t.transactionDate);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;
        return startDate && endDate && txDate >= startDate && txDate <= endDate;
      });
    }

    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    return result;
  }, [transactions, filters]);

  // Handle delete
  const handleDeleteClick = useCallback((transaction: SupplierTransaction) => {
    setConfirmDeleteDialog({ open: true, transaction });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDeleteDialog.transaction) {
      const transactionId = confirmDeleteDialog.transaction.id;
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      setConfirmDeleteDialog({ open: false, transaction: null });
    }
  }, [confirmDeleteDialog.transaction]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteDialog({ open: false, transaction: null });
  }, []);

  // Get columns
  const columns = useSupplierTransactionColumns({ onDelete: handleDeleteClick });

  // Table filters
  const { columnFilters } = useTableFilters();

  // Table columns
  const { tableColumns } = useTableColumns<SupplierTransaction>({
    columns,
    enableRowSelection: false
  });

  // Table selection state
  const { rowSelection, setRowSelection } = useTableSelection();

  // Create table instance
  const { table } = useTable<SupplierTransaction>({
    data: filteredTransactions,
    columns: tableColumns,
    columnFilters,
    rowSelection,
    onRowSelectionChange: setRowSelection,
    initialPageSize: 25,
    enableRowSelection: false
  });

  // Table CSV export
  useTableCSV<SupplierTransaction>({
    table,
    enabled: true
  });

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: SupplierTransactionHistoryFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle export Excel
  const handleExportExcel = useCallback(() => {
    // TODO: Implement Excel export
    alert('Chức năng Export Excel đang được phát triển');
  }, []);

  // Handle export PDF
  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export
    alert('Chức năng Export PDF đang được phát triển');
  }, []);

  // Handle back to supplier
  const handleBack = useCallback(() => {
    if (id) {
      navigate(SUPPLIER_URLS.DETAIL(id));
    } else {
      navigate(SUPPLIER_URLS.LIST);
    }
  }, [navigate, id]);

  // Count active filters for badge - MUST be before any conditional returns
  const activeFilterCount = useMemo(() => {
    return (filters.startDate ? 1 : 0) + (filters.endDate ? 1 : 0) + (filters.type ? 1 : 0) + (filters.status ? 1 : 0);
  }, [filters]);

  if (!supplier) {
    return (
      <MainCard title="Lịch sử giao dịch nhà cung cấp">
        <Alert severity="error" sx={{ mb: 2 }}>
          Không tìm thấy nhà cung cấp
        </Alert>
        <Button variant="outlined" onClick={() => navigate(SUPPLIER_URLS.LIST)}>
          Quay lại danh sách
        </Button>
      </MainCard>
    );
  }

  return (
    <MainCard
      title={`Lịch sử giao dịch: ${supplier.name}`}
      secondary={
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={intl.formatMessage({ id: 'filter' })}>
            <IconButton
              ref={filterAnchorRef}
              size="medium"
              color={activeFilterCount > 0 ? 'primary' : 'default'}
              onClick={filterPopover.onTrue}
              sx={{
                ...(activeFilterCount > 0 && {
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.primary.dark + 20 : theme.palette.primary.light)
                })
              }}
            >
              <FilterOutlined />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" color="secondary" startIcon={<ArrowLeftOutlined />} onClick={handleBack}>
            Quay lại NCC
          </Button>

          <Button variant="outlined" color="success" startIcon={<FileExcelOutlined />} onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button variant="outlined" color="error" startIcon={<FilePdfOutlined />} onClick={handleExportPDF}>
            Export PDF
          </Button>
        </Stack>
      }
    >
      {/* Table */}
      <SupplierTransactionTable table={table} data={filteredTransactions} loading={isLoading} />

      {/* Filter Popover */}
      <SupplierTransactionFilterPopover
        open={filterPopover.value}
        onClose={filterPopover.onFalse}
        anchorEl={filterAnchorRef.current}
        supplier={supplier}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={confirmDeleteDialog.transaction ? `Bạn có chắc chắn muốn xóa giao dịch ${confirmDeleteDialog.transaction.code}?` : ''}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          confirmDeleteDialog.transaction
            ? [
                { label: 'Mã giao dịch', value: confirmDeleteDialog.transaction.code },
                { label: 'Ngày giao dịch', value: new Date(confirmDeleteDialog.transaction.transactionDate).toLocaleDateString('vi-VN') },
                { label: 'Loại giao dịch', value: confirmDeleteDialog.transaction.type === 'import' ? 'Nhập gỗ' : 'Điều chỉnh' },
                {
                  label: 'Sản lượng (m³)',
                  value: confirmDeleteDialog.transaction.quantity.toLocaleString('vi-VN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default SupplierTransactionHistoryPage;
