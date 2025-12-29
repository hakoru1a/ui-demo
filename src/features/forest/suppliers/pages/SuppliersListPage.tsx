import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';
import { StatusFilter } from 'types/status';

import SupplierTable from '../components/SupplierTable';
import SupplierTableHeader from '../components/SupplierTableHeader';
import { useSuppliersTable } from '../hooks/useSuppliersTable';
import type { Supplier } from '../types';

// Mock data - TODO: Replace with API call
const getMockSuppliers = (): Supplier[] => [
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
  },
  {
    id: '2',
    code: 'NCC002',
    name: 'Nguyễn Văn B',
    type: 'individual',
    phone: '0987654321',
    email: 'nguyenvanb@email.com',
    address: '456 Đường ABC, Quận 2, TP.HCM',
    region: 'Gia Lai',
    status: 'active',
    certificates: ['FSC'],
    averageMonthlyYield: 800.25,
    notes: ''
  },
  {
    id: '3',
    code: 'NCC003',
    name: 'HTX Lâm nghiệp XYZ',
    type: 'business',
    representative: 'Trần Thị C',
    phone: '0901234567',
    region: 'Kon Tum',
    status: 'inactive',
    certificates: [],
    averageMonthlyYield: 600.0
  }
];

// ==============================|| SUPPLIERS LIST PAGE ||============================== //

const SuppliersListPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(getMockSuppliers());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const [searchValue, setSearchValue] = useState('');

  // Handle bulk delete
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; suppliers: Supplier[] }>({
    open: false,
    suppliers: []
  });

  const handleBulkDelete = useCallback((selectedSuppliers: Supplier[]) => {
    setConfirmDeleteDialog({ open: true, suppliers: selectedSuppliers });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDeleteDialog.suppliers.length > 0) {
      const idsToDelete = confirmDeleteDialog.suppliers.map((s) => s.id);
      setSuppliers((prev) => prev.filter((s) => !idsToDelete.includes(s.id)));
      setConfirmDeleteDialog({ open: false, suppliers: [] });
    }
  }, [confirmDeleteDialog.suppliers]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteDialog({ open: false, suppliers: [] });
  }, []);

  // Handle stop cooperation
  const [confirmStopDialog, setConfirmStopDialog] = useState<{ open: boolean; suppliers: Supplier[] }>({
    open: false,
    suppliers: []
  });

  const handleStopCooperation = useCallback((selectedSuppliers: Supplier[]) => {
    setConfirmStopDialog({ open: true, suppliers: selectedSuppliers });
  }, []);

  const handleConfirmStop = useCallback(() => {
    if (confirmStopDialog.suppliers.length > 0) {
      const idsToUpdate = confirmStopDialog.suppliers.map((s) => s.id);
      setSuppliers((prev) => prev.map((s) => (idsToUpdate.includes(s.id) ? { ...s, status: 'inactive' as const } : s)));
      setConfirmStopDialog({ open: false, suppliers: [] });
    }
  }, [confirmStopDialog.suppliers]);

  const handleCancelStop = useCallback(() => {
    setConfirmStopDialog({ open: false, suppliers: [] });
  }, []);

  // Handle single delete
  const [confirmSingleDeleteDialog, setConfirmSingleDeleteDialog] = useState<{ open: boolean; supplier: Supplier | null }>({
    open: false,
    supplier: null
  });

  const handleDeleteClick = useCallback((supplier: Supplier) => {
    setConfirmSingleDeleteDialog({ open: true, supplier });
  }, []);

  const handleConfirmSingleDelete = useCallback(() => {
    if (confirmSingleDeleteDialog.supplier) {
      const supplierId = confirmSingleDeleteDialog.supplier.id;
      setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
      setConfirmSingleDeleteDialog({ open: false, supplier: null });
    }
  }, [confirmSingleDeleteDialog.supplier]);

  const handleCancelSingleDelete = useCallback(() => {
    setConfirmSingleDeleteDialog({ open: false, supplier: null });
  }, []);

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useSuppliersTable({
    data: suppliers,
    statusFilter,
    searchValue,
    onDelete: handleDeleteClick,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <SupplierTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="suppliers-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
        onBulkDelete={handleBulkDelete}
        onStopCooperation={handleStopCooperation}
      />
      <SupplierTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa ${confirmDeleteDialog.suppliers.length} nhà cung cấp đã chọn?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
      />

      {/* Confirm Stop Cooperation Dialog */}
      <ConfirmDialog
        open={confirmStopDialog.open}
        onClose={handleCancelStop}
        onConfirm={handleConfirmStop}
        title="Xác nhận ngưng hợp tác"
        message={`Bạn có chắc chắn muốn ngưng hợp tác với ${confirmStopDialog.suppliers.length} nhà cung cấp đã chọn?`}
        confirmText="Ngưng hợp tác"
        cancelText="Hủy"
        confirmColor="warning"
      />

      {/* Confirm Single Delete Dialog */}
      <ConfirmDialog
        open={confirmSingleDeleteDialog.open}
        onClose={handleCancelSingleDelete}
        onConfirm={handleConfirmSingleDelete}
        title="Xác nhận xóa"
        message={
          confirmSingleDeleteDialog.supplier ? `Bạn có chắc chắn muốn xóa nhà cung cấp ${confirmSingleDeleteDialog.supplier.name}?` : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          confirmSingleDeleteDialog.supplier
            ? [
                { label: 'Mã NCC', value: confirmSingleDeleteDialog.supplier.code },
                { label: 'Tên nhà cung cấp', value: confirmSingleDeleteDialog.supplier.name },
                { label: 'Khu vực', value: confirmSingleDeleteDialog.supplier.region },
                { label: 'Trạng thái', value: confirmSingleDeleteDialog.supplier.status === 'active' ? 'Hoạt động' : 'Ngưng hợp tác' }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default SuppliersListPage;
